import { Client } from "@elastic/elasticsearch";
import { config } from "./config";
import { winstonLogger } from "@keychain3/shared";
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'paymentElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
    node: `${config.ELASTIC_SEARCH_URL}`,
    auth: {
        username: 'elastic',
        password: 'admin1234'
    }
});

export async function checkConnection(): Promise<void> {
    let isConnected = false;
    while (!isConnected) {
        try {
            const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
            log.info(`PaymentService ElasticSearch health status - ${health.status}`);
            isConnected = true;
        } catch (error) {
            log.error('Connection to Elasticsearch failed. Retrying...');
            log.log('error', 'PaymentService checkConnection() method', error);
        }
    }
}

export async function logToElasticsearch(logEntry: object): Promise<void> {
    try {
        await elasticSearchClient.index({
            index: `logs-${new Date().toISOString().split('T')[0]}`,
            body: logEntry
        });
    } catch (error) {
        log.error('Error indexing log entry:', error);
    }
}