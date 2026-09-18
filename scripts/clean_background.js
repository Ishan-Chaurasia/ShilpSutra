const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = 'C:/Users/Ishan Chaurasia/.gemini/antigravity/brain/5c8a4e3a-1440-44a4-9767-9083315f9d55/.user_uploaded/media_1789664945262.jpg';
const outputPathJpg = path.resolve(__dirname, '../public/images/hero-bg.jpg');
const outputPathPng = path.resolve(__dirname, '../test_full_clean.png');

async function processImage() {
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  function getP(x, y) {
    if (x < 0) x = 0; if (x >= w) x = w - 1;
    if (y < 0) y = 0; if (y >= h) y = h - 1;
    const i = (y * w + x) * 3;
    return [data[i], data[i+1], data[i+2]];
  }

  function setP(x, y, rgb) {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    const i = (y * w + x) * 3;
    data[i] = Math.max(0, Math.min(255, Math.round(rgb[0])));
    data[i+1] = Math.max(0, Math.min(255, Math.round(rgb[1])));
    data[i+2] = Math.max(0, Math.min(255, Math.round(rgb[2])));
  }

  let seed = 42;
  function random() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  // 1. LEFT BUTTON ("EXPLORE OUR STORY")
  // Full image coords: x from 198 to 384, y from 254 to 292
  // We sample yTop = 252 (just below the inner top rail which is at y=248)
  // and yBtm = 294 (just above the inner bottom rail which is at y=298)
  const leftX1 = 198, leftX2 = 384;
  const leftYTop = 252, leftYBtm = 294;

  for (let x = leftX1; x <= leftX2; x++) {
    const pTop = getP(x, leftYTop);
    const pBtm = getP(x, leftYBtm);

    for (let y = leftYTop + 1; y < leftYBtm; y++) {
      const t = (y - leftYTop) / (leftYBtm - leftYTop);
      const noise = (random() - 0.5) * 2;
      const r = pTop[0] * (1 - t) + pBtm[0] * t + noise;
      const g = pTop[1] * (1 - t) + pBtm[1] * t + noise;
      const b = pTop[2] * (1 - t) + pBtm[2] * t + noise;
      setP(x, y, [r, g, b]);
    }
  }

  // 2. RIGHT BUTTON ("SHOP NOW")
  // Full image coords: x from 638 to 830, y from 254 to 291
  // yTop = 252, yBtm = 293
  const rightX1 = 638, rightX2 = 830;
  const rightYTop = 252, rightYBtm = 293;

  for (let x = rightX1; x <= rightX2; x++) {
    const pTop = getP(x, rightYTop);
    const pBtm = getP(x, rightYBtm);

    for (let y = rightYTop + 1; y < rightYBtm; y++) {
      const t = (y - rightYTop) / (rightYBtm - rightYTop);
      const noise = (random() - 0.5) * 2;
      const r = pTop[0] * (1 - t) + pBtm[0] * t + noise;
      const g = pTop[1] * (1 - t) + pBtm[1] * t + noise;
      const b = pTop[2] * (1 - t) + pBtm[2] * t + noise;
      setP(x, y, [r, g, b]);
    }
  }

  // 3. GEMINI WATERMARK (bottom right sparkle diamond)
  // Sparkle center is around (933.5, 395) [since x in 880..970 was 53.5, y was 45 -> 880+53.5=933.5, 350+45=395]
  // Let's create a precise mask for the 4-point sparkle star:
  const wmMask = new Uint8Array(w * h);
  for (let y = 368; y <= 420; y++) {
    // Reference floor at x = 960 (clean dark wood)
    const ref = getP(960, y);
    const refLum = 0.299 * ref[0] + 0.587 * ref[1] + 0.114 * ref[2];

    for (let x = 912; x <= 956; x++) {
      // Avoid rug fringe on bottom-left:
      if (y > 405 && x < 912 + (y - 405) * 1.0) continue;

      const p = getP(x, y);
      const lum = 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2];

      if (lum > refLum + 6) {
        wmMask[y * w + x] = 1;
      }
    }
  }

  // Dilate by 1 pixel
  const dilated = new Uint8Array(wmMask);
  for (let y = 365; y <= 425; y++) {
    for (let x = 910; x <= 960; x++) {
      if (wmMask[y * w + x]) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            dilated[(y + dy) * w + (x + dx)] = 1;
          }
        }
      }
    }
  }

  // Float buffers for Laplace solver
  const R = new Float32Array(w * h);
  const G = new Float32Array(w * h);
  const B = new Float32Array(w * h);

  for (let i = 0; i < w * h; i++) {
    R[i] = data[i * 3];
    G[i] = data[i * 3 + 1];
    B[i] = data[i * 3 + 2];
  }

  // Initialize with horizontal floor pixels from x = 960
  for (let y = 365; y <= 425; y++) {
    for (let x = 910; x <= 960; x++) {
      if (dilated[y * w + x]) {
        R[y * w + x] = data[(y * w + 960) * 3];
        G[y * w + x] = data[(y * w + 960) * 3 + 1];
        B[y * w + x] = data[(y * w + 960) * 3 + 2];
      }
    }
  }

  // Iterative Laplace solver with horizontal wood grain bias
  for (let iter = 0; iter < 150; iter++) {
    for (let y = 365; y <= 425; y++) {
      for (let x = 910; x <= 960; x++) {
        const idx = y * w + x;
        if (dilated[idx]) {
          R[idx] = (2 * R[idx - 1] + 2 * R[idx + 1] + R[idx - w] + R[idx + w]) / 6;
          G[idx] = (2 * G[idx - 1] + 2 * G[idx + 1] + G[idx - w] + G[idx + w]) / 6;
          B[idx] = (2 * B[idx - 1] + 2 * B[idx + 1] + B[idx - w] + B[idx + w]) / 6;
        }
      }
    }
  }

  for (let y = 365; y <= 425; y++) {
    for (let x = 910; x <= 960; x++) {
      const idx = y * w + x;
      if (dilated[idx]) {
        const noise = (random() - 0.5) * 2;
        data[idx * 3] = Math.max(0, Math.min(255, Math.round(R[idx] + noise)));
        data[idx * 3 + 1] = Math.max(0, Math.min(255, Math.round(G[idx] + noise)));
        data[idx * 3 + 2] = Math.max(0, Math.min(255, Math.round(B[idx] + noise)));
      }
    }
  }

  // Save to PNG for verification
  await sharp(data, { raw: { width: w, height: h, channels: 3 } })
    .png()
    .toFile(outputPathPng);

  // Ensure public/images directory exists
  fs.mkdirSync(path.dirname(outputPathJpg), { recursive: true });

  // Save highest quality JPEG for web background
  await sharp(data, { raw: { width: w, height: h, channels: 3 } })
    .jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
    .toFile(outputPathJpg);

  // Also save a copy as shilpsutra-bg.jpg
  await sharp(data, { raw: { width: w, height: h, channels: 3 } })
    .jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
    .toFile(path.resolve(__dirname, '../public/images/shilpsutra-bg.jpg'));

  console.log('Successfully generated cleaned background images at:');
  console.log(outputPathJpg);
  console.log(outputPathPng);
}

processImage().catch(console.error);
