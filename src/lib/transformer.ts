export type WorkerMessage = 
  | { status: 'progress'; data: { file: string; progress: number } }
  | { status: 'complete'; output: string }
  | { status: 'error'; error: string };

export class TransformerEngine {
  private worker: Worker | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.worker = new Worker(new URL('./worker.ts', import.meta.url));
    }
  }

  async humanize(text: string, onProgress?: (progress: number) => void): Promise<string> {
    if (!this.worker) return text;

    return new Promise((resolve, reject) => {
      const handleMessage = (event: MessageEvent<WorkerMessage>) => {
        if (event.data.status === 'progress') {
          if (onProgress) onProgress(event.data.data.progress || 0);
        } else if (event.data.status === 'complete') {
          this.worker?.removeEventListener('message', handleMessage);
          resolve(event.data.output);
        } else if (event.data.status === 'error') {
          this.worker?.removeEventListener('message', handleMessage);
          reject(new Error(event.data.error));
        }
      };

      this.worker?.addEventListener('message', handleMessage);
      this.worker?.postMessage({ text });
    });
  }

  terminate() {
    this.worker?.terminate();
    this.worker = null;
  }
}

// Export a singleton instance for easy use in components
let instance: TransformerEngine | null = null;
export const getTransformer = () => {
  if (!instance) {
    instance = new TransformerEngine();
  }
  return instance;
};
