import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  endpoint: process.env.DYNAMO_ENDPOINT,
});

export const db = DynamoDBDocumentClient.from(client);
