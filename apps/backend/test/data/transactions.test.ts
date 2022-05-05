import { test, expect } from "@jest/globals";
import { ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { db } from "../../lib/data/dynamo";
import {
  listTransactions,
  createTransaction,
  deleteTransaction,
} from "../../lib/data/transactions";
import { TransactionEntity } from "../../lib/entity/transaction-entity";

test("should have table named Transactions", async () => {
  const list = new ListTablesCommand({});
  const result = await db.send(list);

  expect(result.TableNames).toStrictEqual(["Transactions"]);
});

test("should respond with empty list of transactions", async () => {
  const transactions = await listTransactions({ userId: "user_unknown" });
  expect(transactions).toStrictEqual([]);
});

test("should respond with list of transactions", async () => {
  const entityA = new TransactionEntity({
    uuid: TransactionEntity.uuid(new Date()),
    userId: "abc",
    date: new Date(2021, 1, 1),
    name: "McDonalds",
    amount: 12.5,
    type: "expenditure",
  });

  const entityB = new TransactionEntity({
    uuid: TransactionEntity.uuid(new Date()),
    userId: "abc",
    date: new Date(2020, 1, 1),
    name: "Waterstones",
    amount: 7.99,
    type: "expenditure",
  });

  await createTransaction(entityA);
  await createTransaction(entityB);

  const transactions = await listTransactions({ userId: "abc" });

  // Take note of the 'date' of each entity. Entity A should come before Entity B
  // as the list is in descending order. The date forms part of the sort key.
  expect(transactions).toStrictEqual([entityA, entityB]);
});

test("should delete transaction", async () => {
  const entityA = new TransactionEntity({
    uuid: TransactionEntity.uuid(new Date()),
    userId: "abcd",
    date: new Date(2021, 1, 1),
    name: "McDonalds",
    amount: 12.5,
    type: "expenditure",
  });

  await createTransaction(entityA);
  await deleteTransaction(entityA.userId, entityA.uuid);

  const transactions = await listTransactions({ userId: "abcd" });
  expect(transactions).toStrictEqual([]);
});
