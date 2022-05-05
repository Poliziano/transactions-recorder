import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const db = new DynamoDBClient({
  endpoint: process.env.DYNAMO_ENDPOINT,
});
