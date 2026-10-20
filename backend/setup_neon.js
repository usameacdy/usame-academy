const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const schema = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');

async function run() {
  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_pTWjctHd7K6q@ep-broad-unit-b4lo1xzy.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('✅ Connected to Neon database!');

  await client.query(schema);
  console.log('✅ Schema tables created!');

  const hash = await bcrypt.hash('Admin@2026', 10);
  await client.query(
    `INSERT INTO users (name, email, password, role) VALUES ('Admin', 'admin@usamacademy.com', $1, 'admin') ON CONFLICT (email) DO NOTHING`,
    [hash]
  );
  console.log('✅ Admin user created: admin@usamacademy.com / Admin@2026');

  await client.end();
  console.log('✅ Database setup complete!');
}

run().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
