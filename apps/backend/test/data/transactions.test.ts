import { test, expect } from "@jest/globals";
import { ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { db } from "../../lib/data/dynamo";
import {
  listTransactions,
  createTransaction,
  deleteTransaction,
  TransactionCreateParams,
} from "../../lib/data/transactions";

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
  const createParamsA: TransactionCreateParams = {
    userId: "abc",
    date: new Date(2021, 1, 1).toISOString(),
    name: "McDonalds",
    amount: 12.5,
    type: "expenditure",
  };

  const createParamsB: TransactionCreateParams = {
    userId: "abc",
    date: new Date(2020, 1, 1).toISOString(),
    name: "Waterstones",
    amount: 7.99,
    type: "expenditure",
  };

  const transactionA = await createTransaction(createParamsA);
  const transactionB = await createTransaction(createParamsB);

  const transactions = await listTransactions({ userId: "abc" });

  // Take note of the 'date' of each entity. Entity A should come before Entity B
  // as the list is in descending order. The date forms part of the sort key.
  expect(transactions).toStrictEqual([transactionA, transactionB]);
});

test("should delete transaction", async () => {
  const createParams: TransactionCreateParams = {
    userId: "abcd",
    date: new Date(2021, 1, 1).toISOString(),
    name: "McDonalds",
    amount: 12.5,
    type: "expenditure",
  };

  const transaction = await createTransaction(createParams);
  await deleteTransaction(createParams.userId, transaction.uuid);

  const transactions = await listTransactions({ userId: "abcd" });
  expect(transactions).toStrictEqual([]);
});
