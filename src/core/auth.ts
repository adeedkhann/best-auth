import pg from 'pg';
import bcrypt from 'bcryptjs';

export class AuthEngine {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    this.pool = pool;
  }

  // User Signup Logic
  async signUp(email: string, password: string) {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const client = await this.pool.connect();
    try {
      // 1. Check karo user pehle se exist toh nahi karta
      const checkUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
      if (checkUser.rows.length > 0) {
        throw new Error("User already exists with this email.");
      }

      // 2. Password secure hash karo
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 3. User ko Database me insert karo
      const result = await client.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
        [email, hashedPassword]
      );

      return {
        success: true,
        user: result.rows[0]
      };
    } catch (error: any) {
      console.error(" BestAuth SignUp Error:", error.message);
      throw error;
    } finally {
      client.release();
    }
  }
}