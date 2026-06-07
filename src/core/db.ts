import pg from 'pg';

const { Pool } = pg;

// Hum user ke tables ka raw schema define kar rahe hain
const USERS_TABLE_SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const SESSIONS_TABLE_SCHEMA = `
  CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

export class DatabaseEngine {
  private pool: pg.Pool;

  constructor(databaseUrl: string) {
    if (!databaseUrl) {
      throw new Error("BestAuth Error: DATABASE_URL provided is empty or invalid.");
    }
    
    // Direct connection pool template
    this.pool = new Pool({
      connectionString: databaseUrl,
      // Render/Supabase ke integration me SSL certificate lagta hai, isliye auto-handle kar rhe hain
      ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false }
    });
  }

  // Ye function background me migrations handle karega
  async autoMigrate() {
    const client = await this.pool.connect();
    try {
      console.log("⚡ BestAuth: Checking database tables and running auto-migrations...");
      
      // Dono tables sequentially execute hongi agar exist nahi karti
      await client.query(USERS_TABLE_SCHEMA);
      await client.query(SESSIONS_TABLE_SCHEMA);
      
      console.log("✅ BestAuth: Tables are synced and ready to use.");
    } catch (error) {
      console.error(" BestAuth Migration Error: Failed to setup tables automatically.", error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Is instance ko query execution ke liye expose karenge baad me
  getPool() {
    return this.pool;
  }
}