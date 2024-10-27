import { Application } from "express";
import { paymentRoutes } from "@payment/routes/payments";

const BASE_PATH_PAYMENT = '/api/v1/payment';

export function appRoutes(app: Application): void {
    app.use(`${BASE_PATH_PAYMENT}`, paymentRoutes());
}