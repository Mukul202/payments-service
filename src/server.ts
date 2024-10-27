import http from "http";

import 'express-async-errors';
import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from "@keychain3/shared";
import { checkConnection } from "@payment/elasticsearch";
import { Application, json, Request, Response, urlencoded, NextFunction } from "express";
import { config } from "@payment/config";
import cors from "cors";
import hpp from "hpp";
import helmet from "helmet";
import compression from "compression";
import { verify } from "jsonwebtoken";
import { createConnection } from "@payment/queues/connection";
import { Channel } from "amqplib";
import { appRoutes } from "@payment/routes";

const SERVER_PORT = 4003;
const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'paymentServer', 'debug');

export let paymentChannel: Channel;

export function start(app: Application): void {
    securityMiddleware(app);
    standardMiddleware(app);
    routesMiddleware(app);
    startQueues();
    startElasticSearch();
    paymentErrorHandler(app);
    startServer(app);
}

async function startElasticSearch(): Promise<void> {
    await checkConnection();
}

function startServer(app: Application): void {
    try {
        const httpServer: http.Server = new http.Server(app);
        log.info(`Worker with process id of ${process.pid} on payment server has started`);
        httpServer.listen(SERVER_PORT, () => {
            log.info(`Payment Server running on port ${SERVER_PORT}`);
        })
    } catch (error) {
        log.log('error', 'PaymentService startServer() method:', error);
    }
}

function securityMiddleware(app: Application): void {
    app.set('trust proxy', 1);
    app.use(hpp());
    app.use(helmet());
    app.use(cors({
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }));
    app.use((req: Request, _res: Response, next: NextFunction) => {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const payload: IAuthPayload = verify(token, config.JWT_TOKEN!) as IAuthPayload;
            req.currentUser = payload;
        }
        next();
    })
}

function standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '200mb' }));
    app.use(urlencoded({ extended: true, limit: '200mb' }));
}

function paymentErrorHandler(app: Application): void {
    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
        log.log('error', `PaymentService ${error.comingFrom}:`, error);
        if (error instanceof CustomError) {
            res.status(error.statusCode).json(error.serializeErrors());
        }
        next();
    })
}

async function startQueues(): Promise<void> {
    paymentChannel = await createConnection() as Channel;
}

function routesMiddleware(app: Application): void {
    appRoutes(app);
}