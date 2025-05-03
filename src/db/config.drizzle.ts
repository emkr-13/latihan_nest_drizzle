import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in the environment variables');
}

// Buat koneksi menggunakan Pool dari pg
const pool = new Pool({
  connectionString: DATABASE_URL,
});

// Export instance Drizzle dengan schema
export const db = drizzle(pool);