import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const logoSourcePath = '/Users/francisco/.gemini/antigravity-ide/brain/e575553e-ee27-40e1-bd27-67cfb4ada112/media__1785982463847.png';
const publicDir = './public/images';
const logoDestPath = path.join(publicDir, 'logo.png');

async function processLogo() {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  console.log('Loading logo from:', logoSourcePath);
  const image = sharp(logoSourcePath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  console.log(`Image dimensions: ${info.width}x${info.height}, channels: ${info.channels}`);

  // Get background color from top-left corner
  const bgR = data[0];
  const bgG = data[1];
  const bgB = data[2];
  console.log(`Detected background color (top-left): rgb(${bgR}, ${bgG}, ${bgB})`);

  // We want to make the background transparent.
  // We'll calculate a mask where pixels close to the background color become transparent.
  // To get smooth edges, we'll interpolate alpha between a lower and upper threshold.
  const outBuffer = Buffer.alloc(info.width * info.height * 4);

  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * info.channels];
    const g = data[i * info.channels + 1];
    const b = data[i * info.channels + 2];

    // Distance to background color
    const dist = Math.sqrt(
      Math.pow(r - bgR, 2) +
      Math.pow(g - bgG, 2) +
      Math.pow(b - bgB, 2)
    );

    let alpha = 255;
    // Thresholds for transparency
    const tLow = 15;  // completely transparent below this distance
    const tHigh = 45; // completely opaque above this distance

    if (dist < tLow) {
      alpha = 0;
    } else if (dist < tHigh) {
      alpha = Math.round(((dist - tLow) / (tHigh - tLow)) * 255);
    }

    outBuffer[i * 4] = r;
    outBuffer[i * 4 + 1] = g;
    outBuffer[i * 4 + 2] = b;
    outBuffer[i * 4 + 3] = alpha;
  }

  await sharp(outBuffer, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
    .png()
    .toFile(logoDestPath);

  console.log('Processed logo saved to:', logoDestPath);
}

processLogo().catch(console.error);
