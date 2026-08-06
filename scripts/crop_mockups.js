import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const mockupPath = '/Users/francisco/.gemini/antigravity-ide/brain/e575553e-ee27-40e1-bd27-67cfb4ada112/media__1785979052128.png';
const publicDir = './public';

const crops = [
  {
    name: 'waveform.png',
    extract: { left: 178, top: 320, width: 196, height: 98 }
  },
  {
    name: 'mobile-fintech.png',
    extract: { left: 630, top: 322, width: 68, height: 138 }
  },
  {
    name: 'mobile-saas.png',
    extract: { left: 708, top: 312, width: 68, height: 138 }
  },
  {
    name: 'mobile-ecommerce.png',
    extract: { left: 782, top: 322, width: 68, height: 138 }
  }
];

async function cropAll() {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  for (const crop of crops) {
    const dest = path.join(publicDir, crop.name);
    console.log(`Cropping ${crop.name} with:`, crop.extract);
    await sharp(mockupPath)
      .extract(crop.extract)
      .toFile(dest);
    console.log(`Saved to ${dest}`);
  }
}

cropAll().catch(console.error);
