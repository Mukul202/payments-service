import { start } from "./server";
import express, { Express } from "express";
import { winstonLogger } from "@keychain3/shared";
import { config } from "./config";

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'paymentApp', 'debug');

function initialize(): void {
    const app: Express = express();
    start(app);
    log.info('Payment Service initialized');
}

initialize();