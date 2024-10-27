import express, { Router } from "express";
import { createSessionKey, initRemoteSigner } from "@payment/controllers/init";

const router: Router = express.Router();

export function paymentRoutes(): Router {
    router.get('/init', createSessionKey);
    router.get('/init-remote-signer', initRemoteSigner);
    return router;
}