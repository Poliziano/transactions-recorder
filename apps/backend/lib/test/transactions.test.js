const { test, expect } = require('@jest/globals');
const { ListTablesCommand } = require("@aws-sdk/client-dynamodb");
const { getOrCreateDynamoClient } = require("./dynamo");

test("Transactions Dynamo table should exist", async () => {
  const client = await getOrCreateDynamoClient();
  const list = new ListTablesCommand({});
  const result = await client.send(list);

  expect(result.TableNames).toStrictEqual(["Transactions"]);
});