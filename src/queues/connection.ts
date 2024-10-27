import client, { Channel, Connection } from "amqplib";
import { Logger } from "winston";
import { config } from "@payment/config";
import { winstonLogger } from "@keychain3/shared";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'paymentQueueConnection', 'debug');

export async function createConnection(): Promise<Channel | undefined> {
    try {
        const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
        const channel: Channel = await connection.createChannel();
        log.info('Payment Service connected to queue successfully.');
        closeConnection(channel, connection);
        return channel;
    } catch (error) {
        log.log('error', 'Payment Service createConnection() method error:', error);
        return undefined;
    }
}

function closeConnection(channel: Channel, connection: Connection) {
    process.once('SIGINT', async () => {
        await channel.close();
        await connection.close();
    })
}