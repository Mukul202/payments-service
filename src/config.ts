import dotenv from "dotenv";

dotenv.config();

class Config {
    public ELASTIC_SEARCH_URL: string | undefined;
    public JWT_TOKEN: string | undefined;
    public RABBITMQ_ENDPOINT: string | undefined;
    public GATEWAY_JWT_TOKEN: string | undefined;
    public API_GATEWAY_URL: string | undefined;
    public NODE_ENV: string | undefined;
    public ZERODEV_SECRET: string | undefined;
    public ZERODEV_PROJECT_ID: string | undefined;
    public ZERODEV_REMOTE_SIGNER_ADDRESS: `0x${string}` | undefined;

    constructor() {
        this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
        this.JWT_TOKEN = process.env.JWT_TOKEN || '';
        this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
        this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '';
        this.API_GATEWAY_URL = process.env.API_GATEWAY_URL || '';
        this.NODE_ENV = process.env.NODE_ENV || '';
        this.ZERODEV_SECRET = process.env.ZERODEV_SECRET || '';
        this.ZERODEV_PROJECT_ID = process.env.ZERODEV_PROJECT_ID || '';
        this.ZERODEV_REMOTE_SIGNER_ADDRESS = process.env.ZERODEV_REMOTE_SIGNER_ADDRESS?.startsWith('0x')
            ? (process.env.ZERODEV_REMOTE_SIGNER_ADDRESS as `0x${string}`)
            : undefined;
    }
}

export const config: Config = new Config();