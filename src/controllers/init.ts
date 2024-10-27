import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { RemoteSignerMode, toRemoteSigner } from "@zerodev/remote-signer";
import { config } from "@payment/config";
import { toECDSASigner } from "@zerodev/permissions/signers";

export async function createSessionKey(_req: Request, res: Response): Promise<void> {
    const signer = await toRemoteSigner({
        apiKey: config.ZERODEV_SECRET!,
        mode: RemoteSignerMode.Create
    });
    const sessionKeySigner = toECDSASigner({
        signer,
    });
    res.status(StatusCodes.OK).json({ message: 'Payment Init Service is healthy.', sessionKeySigner });
}

export async function initRemoteSigner(_req: Request, res: Response): Promise<void> {

    const signer = await toRemoteSigner({
        apiKey: config.ZERODEV_SECRET!,
        mode: RemoteSignerMode.Get,
        keyAddress: config.ZERODEV_REMOTE_SIGNER_ADDRESS!,
    });

    const sessionKeySigner = toECDSASigner({
        signer,
    });

    res.status(StatusCodes.OK).json({ message: 'Payment InitRemoteSigner Service is healthy.', sessionKeySigner });
}