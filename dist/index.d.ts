import pg from 'pg';

declare class AuthEngine {
    private pool;
    constructor(pool: pg.Pool);
    signUp(email: string, password: string): Promise<{
        success: boolean;
        user: any;
    }>;
}

interface BestAuthConfig {
    databaseUrl: string;
    jwtSecret?: string;
}
declare class BestAuth {
    private db;
    private jwtSecret;
    auth: AuthEngine;
    constructor(config: BestAuthConfig);
    private init;
}
declare const createBestAuth: (config: BestAuthConfig) => BestAuth;

export { BestAuth, createBestAuth };
