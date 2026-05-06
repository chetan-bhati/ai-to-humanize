import { pipeline, env } from '@huggingface/transformers';

// Configure environment for local model serving
env.allowLocalModels = true;
env.allowRemoteModels = true; // Fallback to remote if local not found during dev
env.localModelPath = '/models/'; // Path relative to public folder in browser

class PipelineSingleton {
  static task = 'text2text-generation';
  static model = 'Xenova/flan-t5-base'; 
  static instance: any = null;

  static async getInstance(progress_callback?: (data: any) => void) {
    if (this.instance === null) {
      this.instance = pipeline(this.task as any, this.model, { progress_callback });
    }
    return this.instance;
  }
}

function postProcess(text: string): string {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^paraphrase:\s*/i, '');
  cleaned = cleaned.replace(/^humanize:\s*/i, '');
  cleaned = cleaned.replace(/^rewrite naturally:\s*/i, '');
  
  // Basic hallucination check: look for common fake facts like "University of California" 
  // if they weren't in the original (this is hard without full context but we can do basic cleaning)
  
  const sentences = cleaned.split(/[.!?]+\s+/);
  const uniqueSentences = Array.from(new Set(sentences));
  return uniqueSentences.join(' ');
}

function chunkText(text: string): string[] {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    if ((currentChunk.length + para.length) > 1200) { // Safer limit for flan-t5-base
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + para;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

self.addEventListener('message', async (event) => {
  const { text } = event.data;

  try {
    // If the instance is already loaded, notify the UI immediately
    if (PipelineSingleton.instance !== null) {
      self.postMessage({ 
        status: 'progress', 
        data: { file: 'Model loaded', progress: 100 } 
      });
    }

    const generator = await PipelineSingleton.getInstance((data) => {
      self.postMessage({ status: 'progress', data });
    });

    const chunks = chunkText(text);
    const results: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      self.postMessage({ 
        status: 'progress', 
        data: { file: `Processing segment ${i + 1}/${chunks.length}`, progress: (i / chunks.length) * 100 } 
      });

      // Shorter, more direct prompt for better T5 performance
      const prompt = `paraphrase naturally: ${chunks[i]}`;
      
      const output = await generator(prompt, {
        max_new_tokens: 300,
        temperature: 0.3, // Lower creativity = fewer hallucinations
        top_p: 0.9,
        repetition_penalty: 1.3, // Stronger penalty for looping
        do_sample: true,
      });

      results.push(postProcess(output[0].generated_text));
    }

    self.postMessage({
      status: 'complete',
      output: results.join("\n\n")
    });
  } catch (error: any) {
    self.postMessage({ status: 'error', error: error.message });
  }
});
