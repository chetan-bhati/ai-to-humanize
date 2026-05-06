import { pipeline, env } from '@huggingface/transformers';

// Configure environment for local model serving
env.allowLocalModels = true;
env.allowRemoteModels = true; 
env.localModelPath = '/models/';

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

function fixGrammar(text: string): string {
  let fixed = text;
  // Fix "a" before vowels
  fixed = fixed.replace(/\b(a)\s+([aeiou])/gi, (match, a, vowel) => {
    return (a === 'A' ? 'An' : 'an') + ' ' + vowel;
  });
  // Fix "an" before consonants
  fixed = fixed.replace(/\b(an)\s+([^aeiouh\W])/gi, (match, an, consonant) => {
    return (an === 'An' ? 'A' : 'a') + ' ' + consonant;
  });
  return fixed;
}

function postProcess(text: string): string {
  let cleaned = text.trim();
  // Remove common model-prefixed responses
  cleaned = cleaned.replace(/^(paraphrase|humanize|rewrite naturally):\s*/i, '');
  
  // Basic grammar cleanup
  return fixGrammar(cleaned);
}

function chunkText(text: string): string[] {
  // Split by double newlines (paragraphs)
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    // 800 chars is a safe limit for flan-t5-base to keep coherence
    if ((currentChunk.length + para.length) > 800) { 
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
    // Immediate feedback that we started
    self.postMessage({ 
      status: 'progress', 
      data: { file: 'Initializing AI engine...', progress: 5 } 
    });

    const generator = await PipelineSingleton.getInstance((data) => {
      // Pass through Transformers.js download/load progress
      self.postMessage({ status: 'progress', data });
    });

    const chunks = chunkText(text);
    const results: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const segmentProgress = Math.round((i / chunks.length) * 100);
      self.postMessage({ 
        status: 'progress', 
        data: { 
          file: `Processing segment ${i + 1} of ${chunks.length}...`, 
          progress: segmentProgress 
        } 
      });

      const prompt = `paraphrase naturally: ${chunks[i]}`;
      
      const output = await generator(prompt, {
        max_new_tokens: 512, // Increased for longer paragraphs
        temperature: 0.3,
        top_p: 0.9,
        repetition_penalty: 1.3,
        do_sample: true,
      });

      results.push(postProcess(output[0].generated_text));
    }

    self.postMessage({
      status: 'complete',
      output: results.join("\n\n")
    });
  } catch (error: any) {
    console.error("Worker Error:", error);
    self.postMessage({ status: 'error', error: error.message });
  }
});
