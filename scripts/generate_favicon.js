import sharp from 'sharp';
import fs from 'fs';

async function generate() {
  const logoPath = 'public/images/logo.png';
  if (!fs.existsSync(logoPath)) {
    console.error('Error: logo.png not found at', logoPath);
    process.exit(1);
  }

  try {
    // Generate 32x32 favicon.ico (as PNG formatted file, compatible with all modern browsers)
    await sharp(logoPath)
      .trim()
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile('public/favicon.ico');
    console.log('Successfully generated public/favicon.ico (32x32)');

    // Generate 192x192 favicon.png (standard high-res shortcut icon)
    await sharp(logoPath)
      .trim()
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile('public/favicon.png');
    console.log('Successfully generated public/favicon.png (192x192)');

  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generate();
