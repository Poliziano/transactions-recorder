import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { GenericContainer } from "testcontainers";
import { db } from "../lib/data/dynamo";

async function setupDynamoForTesting() {
  const tableConfig = {
    TableName: "Transactions",
    KeySchema: [
      {
        KeyType: "HASH",
        AttributeName: "PK",
      },
      {
        KeyType: "RANGE",
        AttributeName: "SK",
      },
    ],
    AttributeDefinitions: [
      {
        AttributeType: "S",
        AttributeName: "PK",
      },
      {
        AttributeType: "S",
        AttributeName: "SK",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  await db.send(new CreateTableCommand(tableConfig));
}

export default async function () {
  // @ts-ignore
  globalThis.container = await new GenericContainer("amazon/dynamodb-local")
    .withExposedPorts({ container: 8000, host: 8090 })
    .start();

  await setupDynamoForTesting();
}
