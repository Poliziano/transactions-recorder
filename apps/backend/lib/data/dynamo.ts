import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  ...(process.env.NODE_ENV === "test" && {
    endpoint: "http://localhost:8000",
  }),
});

export const db = DynamoDBDocumentClient.from(client);
