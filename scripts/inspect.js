const sharp = require('sharp');

const inputPath = 'C:/Users/Ishan Chaurasia/.gemini/antigravity/brain/5c8a4e3a-1440-44a4-9767-9083315f9d55/.user_uploaded/media_1789664945262.jpg';

async function run() {
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  function getPixel(x, y) {
    if (x < 0 || x >= w || y < 0 || y >= h) return [0,0,0];
    const idx = (y * w + x) * 3;
    return [data[idx], data[idx+1], data[idx+2]];
  }

  // Inspect Right Button
  console.log('=== Right Moulding Profile ===');
  for (let x = 805; x <= 830; x++) {
    const pAbove = getPixel(x, 235);
    const pBelow = getPixel(x, 315);
    console.log(`x=${x}: above=[${pAbove}] below=[${pBelow}]`);
  }

  // Also check left side of right button:
  console.log('=== Left side of Right Button ===');
  for (let x = 620; x <= 645; x++) {
    const pAbove = getPixel(x, 235);
    const pMid = getPixel(x, 275);
    const pBelow = getPixel(x, 315);
    console.log(`x=${x}: above=[${pAbove}] mid=[${pMid}] below=[${pBelow}]`);
  }
}

run();
