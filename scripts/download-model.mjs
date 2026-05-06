import fs from 'fs';
import path from 'path';
import https from 'https';

const MODEL_ID = 'Xenova/flan-t5-base';
const BASE_URL = `https://huggingface.co/${MODEL_ID}/resolve/main/`;
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'models', MODEL_ID);

const FILES = [
  'config.json',
  'tokenizer_config.json',
  'tokenizer.json',
  'generation_config.json',
  'onnx/encoder_model_quantized.onnx',
  'onnx/decoder_model_merged_quantized.onnx'
];

async function downloadFile(url, dest) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // Handle redirects (including relative URLs)
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        try {
          const redirectUrl = new URL(response.headers.location, url).href;
          downloadFile(redirectUrl, dest).then(resolve).catch(reject);
        } catch (e) {
          reject(new Error(`Invalid redirect URL: ${response.headers.location}`));
        }
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function main() {
  console.log(`🚀 Starting download of ${MODEL_ID} into ${OUTPUT_DIR}...`);
  
  for (const fileName of FILES) {
    const url = `${BASE_URL}${fileName}`;
    const dest = path.join(OUTPUT_DIR, fileName);
    
    if (fs.existsSync(dest)) {
      console.log(`✅ ${fileName} already exists, skipping.`);
      continue;
    }
    
    console.log(`⏳ Downloading ${fileName}...`);
    try {
      await downloadFile(url, dest);
      console.log(`✅ Downloaded ${fileName}`);
    } catch (err) {
      console.error(`❌ Error downloading ${fileName}: ${err.message}`);
      
      // Fallback for non-quantized if primary fails
      if (fileName.includes('_quantized')) {
        const alt = fileName.replace('_quantized', '');
        console.log(`🔄 Trying non-quantized version: ${alt}...`);
        try {
          await downloadFile(`${BASE_URL}${alt}`, path.join(OUTPUT_DIR, alt));
          console.log(`✅ Downloaded ${alt}`);
        } catch (innerErr) {
          console.error(`❌ Failed alternate download: ${innerErr.message}`);
        }
      }
    }
  }
  
  console.log('🎉 Model download complete!');
  process.exit(0);
}

main();
