import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  PutCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { NativeAttributeValue } from "@aws-sdk/util-dynamodb";
import { afterEach, jest } from "@jest/globals";
import { db } from "../lib/data/dynamo";

type Item = {
  attributes: NativeAttributeValue;
  tableName: string;
};

/**
 * DO NOT MOCK THIS IN TESTS, THE OUTCOME IS UNKNOWN!
 *
 * Deleting the DynamoDB table after each test is both expensive and unreliable. Often the table is not
 * deleted or recreated in time when the tests re-run, leading to failures.
 *
 * This approach is to listen for all Put requests that occur within a test, then delete them afterwards.
 * Typically there are not many items created, so the operation is inexpensive. The other benefits is that
 * if not DynamoDB queries are made then there is no clean up. It only runs when something has been created.
 */
const clientSpy = jest.spyOn(db, "send");

/**
 * Define the attributes that form the simple or composition primary key for a given table.
 */
const primaryKeyMappings: Record<string, string[]> = {
  Transactions: ["PK", "SK"],
};

afterEach(async () => {
  await deleteDynamoDBItems(clientSpy.mock.calls.map((call) => call[0]));
});

async function deleteDynamoDBItems(commands: any[]) {
  const items: Item[] = [];

  for (const command of commands) {
    items.push(
      ...extractPutCommandKey(command),
      ...extractTransactionCommandKeys(command),
      ...extractBatchWriteCommandKeys(command)
    );
  }

  const itemsByTable = new Map<string, Item[]>();
  for (const item of items) {
    const existingItems = itemsByTable.get(item.tableName) ?? [];
    const existingItem = existingItems.find((value) => {
      const key1 = getItemPrimaryKey(value);
      const key2 = getItemPrimaryKey(item);

      return JSON.stringify(key1) == JSON.stringify(key2);
    });

    if (!existingItem) {
      itemsByTable.set(item.tableName, [...existingItems, item]);
    }
  }

  const requests: BatchWriteCommandInput["RequestItems"] = {};
  for (const [tableName, values] of itemsByTable) {
    requests[tableName] = values.map((item) => ({
      DeleteRequest: {
        Key: getItemPrimaryKey(item),
      },
    }));
  }

  const command = new BatchWriteCommand({
    RequestItems: requests,
  });

  if (items.length > 0) {
    await db.send(command);
  }
}

function extractPutCommandKey(command: PutCommand): Item[] {
  if (command?.input?.Item == null) {
    return [];
  }
  return [
    {
      attributes: command.input.Item,
      tableName: command.input.TableName!,
    },
  ];
}

function extractTransactionCommandKeys(command: TransactWriteCommand): Item[] {
  const result: Item[] = [];
  for (const item of command?.input?.TransactItems ?? []) {
    if (item.Put?.Item) {
      result.push({
        attributes: item.Put.Item,
        tableName: item.Put.TableName!,
      });
    }
  }
  return result;
}

function extractBatchWriteCommandKeys(command: BatchWriteCommand): Item[] {
  const result: Item[] = [];
  const tables = Object.keys(command?.input?.RequestItems ?? {});

  for (const tableName of tables) {
    const items = command?.input?.RequestItems?.[tableName];
    if (!Array.isArray(items)) {
      continue;
    }

    for (const item of items) {
      if (item.PutRequest?.Item) {
        result.push({
          attributes: item.PutRequest.Item,
          tableName,
        });
      }
    }
  }

  return result;
}

function getItemPrimaryKey(item: Item): Record<string, string> {
  const attributes = primaryKeyMappings[item.tableName];
  if (!attributes) {
    throw new Error(
      `Unknown table ${item.tableName}. Please provide a mapping for the primary key to faciliate DynamoDB clean up after each test.`
    );
  }

  return attributes.reduce<Record<string, string>>((key, attr) => {
    key[attr] = item.attributes[attr];
    return key;
  }, {});
}
