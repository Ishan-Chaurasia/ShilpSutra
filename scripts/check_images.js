const fs = require('fs');
const path = require('path');

async function checkAll() {
  const files = [
    'data/initialProducts.ts',
    'data/sampleCrafts.ts',
    'data/initialArtisans.ts',
    'data/initialBuyers.ts',
    'lib/aiImageService.ts'
  ];

  const allUrls = new Set();
  for (const f of files) {
    const full = path.resolve(__dirname, '..', f);
    if (fs.existsSync(full)) {
      const txt = fs.readFileSync(full, 'utf8');
      const matches = txt.match(/https:\/\/images\.unsplash\.com\/[^\s"',]+/g) || [];
      matches.forEach(u => allUrls.add(u));
    }
  }

  console.log(`Found ${allUrls.size} unique Unsplash URLs across codebase. Testing...`);

  let okCount = 0;
  let failCount = 0;

  for (const url of allUrls) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.status === 200) {
        okCount++;
        console.log(`✓ [${res.status}] ${url.slice(0, 70)}...`);
      } else {
        failCount++;
        console.log(`✗ [${res.status}] ${url}`);
      }
    } catch (e) {
      failCount++;
      console.log(`✗ [ERR] ${url}: ${e.message}`);
    }
  }

  console.log(`\nResults: ${okCount} OK, ${failCount} Failed.`);
}

checkAll().catch(console.error);
