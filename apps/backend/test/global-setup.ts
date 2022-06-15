import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { GenericContainer } from "testcontainers";
import { db } from "../lib/data/dynamo";

const originalExit = process.exit;
// @ts-expect-error override the exit.
process.exit = async function (code?: number) {
  // @ts-expect-error
  const container: StartedTestContainer = globalThis.__DYNAMODB__;
  if (container) {
    console.log("Shutting down test container");
    await container.stop();
  }

  originalExit(code);
};

export default async function () {
  // @ts-expect-error
  if (globalThis.__DYNAMODB__) {
    return;
  }

  // @ts-expect-error
  globalThis.__DYNAMODB__ = await new GenericContainer("amazon/dynamodb-local")
    .withExposedPorts({
      host: 8000,
      container: 8000,
    })
    .start();

  await createDynamoTable();
}

async function createDynamoTable() {
  const command = new CreateTableCommand({
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
  });

  await db.send(command);
}
