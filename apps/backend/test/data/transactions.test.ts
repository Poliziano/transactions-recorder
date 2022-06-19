import { ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { expect, test } from "@jest/globals";
import { db } from "../../lib/data/dynamo";
import {
  createTransaction,
  deleteTransaction,
  listDailyTransactionAggregations,
  listTransactions,
  listTransactionsForDate,
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
  expect(transactions).toStrictEqual([transactionA, transactionB]);
});

test("should respond with list of transactions for date", async () => {
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
  await createTransaction(createParamsB);

  const transactions = await listTransactionsForDate({
    userId: "abc",
    date: "2021-02-01",
  });
  expect(transactions).toStrictEqual([transactionA]);
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
  await deleteTransaction({
    userId: createParams.userId,
    transactionId: transaction.uuid,
  });

  const transactions = await listTransactions({ userId: "abcd" });
  expect(transactions).toStrictEqual([]);
});

test("should update transaction summation", async () => {
  const createParamsA: TransactionCreateParams = {
    userId: "abc",
    date: new Date(2021, 1, 1).toISOString(),
    name: "McDonalds",
    amount: 12.5,
    type: "expenditure",
  };

  const createParamsB: TransactionCreateParams = {
    userId: "abc",
    date: new Date(2021, 1, 1).toISOString(),
    name: "Waterstones",
    amount: 7.99,
    type: "expenditure",
  };

  const createParamsC: TransactionCreateParams = {
    userId: "abc",
    date: new Date(2021, 11, 4).toISOString(),
    name: "Waterstones",
    amount: 25,
    type: "expenditure",
  };

  await createTransaction(createParamsA);
  await createTransaction(createParamsB);
  await createTransaction(createParamsC);

  const dailyAggregation = await listDailyTransactionAggregations({
    userId: "abc",
  });
  expect(dailyAggregation).toEqual([
    {
      userId: "abc",
      type: "SUM",
      year: 2021,
      entries: {
        "2021-12-04": 25,
        "2021-02-01": 20.49,
      },
    },
  ]);
});
