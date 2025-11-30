require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

console.log("1. Attempting to connect to database...");
console.log(`   User: ${process.env.DB_USER}`);
console.log(`   Database: ${process.env.DB_DATABASE}`);
console.log(`   Port: ${process.env.DB_PORT}`);

pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ CONNECTION FAILED!");
    console.error(err.message); // This is the secret error message we need!
  } else {
    console.log("✅ CONNECTION SUCCESSFUL!");
    console.log("   The database is ready and listening.");
    release();
  }
});