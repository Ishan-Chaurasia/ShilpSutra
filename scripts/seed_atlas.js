const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shilpsutra';

async function seed() {
  console.log('Connecting to Atlas to seed initial listings and artisans...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('shilpsutra');

  // Load products data
  const initialProductsPath = path.resolve(__dirname, '../data/initialProducts.ts');
  const initialArtisansPath = path.resolve(__dirname, '../data/initialArtisans.ts');
  const initialBuyersPath = path.resolve(__dirname, '../data/initialBuyers.ts');

  // Parse products
  const prodRaw = fs.readFileSync(initialProductsPath, 'utf8');
  // Match products JSON array
  const prodMatch = prodRaw.match(/export const initialProducts: Product\[\] = (\[[\s\S]*?\]);\n/);
  const products = eval(prodMatch[1]);

  // Parse artisans
  const artRaw = fs.readFileSync(initialArtisansPath, 'utf8');
  const artMatch = artRaw.match(/export const initialArtisans: Artisan\[\] = (\[[\s\S]*?\]);\n/);
  const artisans = eval(artMatch[1]);

  // Parse buyers
  const buyerRaw = fs.readFileSync(initialBuyersPath, 'utf8');
  const buyerMatch = buyerRaw.match(/export const initialBuyerMatches: BuyerMatch\[\] = (\[[\s\S]*?\]);\n/);
  const buyers = eval(buyerMatch[1]);

  console.log(`Parsed ${products.length} products, ${artisans.length} artisans, ${buyers.length} buyer matches.`);

  // 1. Seed Products
  const prodCol = db.collection('products');
  await prodCol.deleteMany({});
  await prodCol.insertMany(products);
  console.log(`✓ Inserted ${products.length} products into collection 'products'.`);

  // 2. Seed Artisans
  const artCol = db.collection('artisans');
  await artCol.deleteMany({});
  await artCol.insertMany(artisans);
  console.log(`✓ Inserted ${artisans.length} artisans into collection 'artisans'.`);

  // 3. Seed Buyers
  const buyerCol = db.collection('buyers');
  await buyerCol.deleteMany({});
  await buyerCol.insertMany(buyers);
  console.log(`✓ Inserted ${buyers.length} buyers into collection 'buyers'.`);

  // Verify counts
  const prodCount = await prodCol.countDocuments();
  const artCount = await artCol.countDocuments();
  const buyerCount = await buyerCol.countDocuments();

  console.log(`\n🎉 SEEDING COMPLETED SUCCESSFULLY!`);
  console.log(`Atlas Collections Status:`);
  console.log(`- products: ${prodCount} documents`);
  console.log(`- artisans: ${artCount} documents`);
  console.log(`- buyers:   ${buyerCount} documents`);

  await client.close();
}

seed().catch(console.error);
