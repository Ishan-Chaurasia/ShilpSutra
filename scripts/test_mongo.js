const { MongoClient } = require('mongodb');

const usernames = ['admin', 'ishan', 'ishanchaurasia', 'shilpsutra', 'root', 'user', 'cluster0', 'db_user', 'dbuser'];
const pwd = 'wGNyyk43soGor4BA';
const host = 'cluster0.zk4chzm.mongodb.net/?appName=Cluster0';

async function test() {
  for (const u of usernames) {
    const uri = `mongodb+srv://${u}:${pwd}@${host}`;
    process.stdout.write(`Testing username: ${u}... `);
    try {
      const client = new MongoClient(uri, { serverSelectionTimeoutMS: 2500 });
      await client.connect();
      console.log(`\n🎉 SUCCESS! MongoDB connected with username: "${u}"`);
      await client.close();
      return u;
    } catch(err) {
      console.log(`failed (${err.message.split('\n')[0].slice(0, 45)})`);
    }
  }
  console.log('\nNone of the common usernames matched.');
}

test().catch(console.error);
