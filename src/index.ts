import { DatabaseEngine } from "./core/db.js";
import { AuthEngine } from "./core/auth.js";

interface BestAuthConfig {
  databaseUrl: string;
  jwtSecret?: string;
}

export class BestAuth {
  private db: DatabaseEngine;
  private jwtSecret: string;
  // Auth handles expose karenge
  public auth: AuthEngine;

  constructor(config: BestAuthConfig) {
    this.db = new DatabaseEngine(config.databaseUrl);
    this.jwtSecret = config.jwtSecret || "super_secret_best_auth_key_change_me";
    
    // Auth class me direct DB pool reference inject kar rhe hain
    this.auth = new AuthEngine(this.db.getPool());
    
    this.init();
  }

  private async init() {
    try {
      await this.db.autoMigrate();
    } catch (e) {
      // Background handling
    }
  }
}

export const createBestAuth = (config: BestAuthConfig) => {
  return new BestAuth(config);
};