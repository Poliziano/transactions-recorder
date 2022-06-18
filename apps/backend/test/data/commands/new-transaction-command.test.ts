import { expect, test } from "@jest/globals";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { NewTransactionCommand } from "../../../lib/data/commands/new-transaction-command";
import { db } from "../../../lib/data/dynamo";
import {
  Transaction,
  transactionUUID,
  toTransactionItem,
} from "../../../lib/entity/transaction";
import {
  TransactionAggregation,
  toTransactionAggregationItem,
} from "../../../lib/entity/transaction-aggregation";

test("should prevent duplicate transactions being created", async () => {
  const transaction: Transaction = {
    uuid: transactionUUID(),
    userId: "abc",
    date: new Date(2021, 1, 1),
    name: "McDonalds",
    amount: 12.5,
    type: "expenditure",
  };

  const putCommand = new PutCommand({
    TableName: "Transactions",
    Item: toTransactionItem(transaction),
  });
  await db.send(putCommand);

  const newTransactionCommand = new NewTransactionCommand({
    transaction,
    update: false,
  });

  await expect(db.send(newTransactionCommand)).rejects.toThrowError();
});

test("should prevent duplicate transactions being updated", async () => {
  const transaction: Transaction = {
    uuid: transactionUUID(),
    userId: "abc",
    date: new Date(2021, 1, 1),
    name: "McDonalds",
    amount: 12.5,
    type: "expenditure",
  };

  const transactionAggregation: TransactionAggregation<number> = {
    userId: "abc",
    type: "SUM",
    year: 2021,
    entries: {
      "2021-02-01": 25,
    },
  };

  const putTransactionCommand = new PutCommand({
    TableName: "Transactions",
    Item: toTransactionItem(transaction),
  });
  const putAggregationCommand = new PutCommand({
    TableName: "Transactions",
    Item: toTransactionAggregationItem(transactionAggregation),
  });
  await db.send(putTransactionCommand);
  await db.send(putAggregationCommand);

  const newTransactionCommand = new NewTransactionCommand({
    transaction,
    update: true,
  });

  await expect(db.send(newTransactionCommand)).rejects.toThrowError();
});
