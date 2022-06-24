import { ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { db } from "../../lib/data/dynamo";
import {
  createTransaction,
  deleteTransaction,
  listDailyTransactionAggregations,
  listTransactions,
  listTransactionsForDate,
  TransactionCreateInput,
} from "../../lib/data/transaction-repository";

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
  const createParamsA: TransactionCreateInput = {
    userId: "abc",
    date: new Date(2021, 1, 1).toISOString(),
    name: "Tesco",
    amount: 12.5,
    type: "expenditure",
  };

  const createParamsB: TransactionCreateInput = {
    userId: "abc",
    date: new Date(2020, 1, 1).toISOString(),
    name: "Sainsburys",
    amount: 7.99,
    type: "expenditure",
  };

  const transactionA = await createTransaction(createParamsA);
  const transactionB = await createTransaction(createParamsB);

  const transactions = await listTransactions({ userId: "abc" });
  expect(transactions).toStrictEqual([transactionA, transactionB]);
});

test("should respond with list of transactions for date", async () => {
  const createParamsA: TransactionCreateInput = {
    userId: "abc",
    date: new Date(2021, 1, 1).toISOString(),
    name: "KFC",
    amount: 12.5,
    type: "expenditure",
  };

  const createParamsB: TransactionCreateInput = {
    userId: "abc",
    date: new Date(2020, 1, 1).toISOString(),
    name: "Arc Cinema",
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
  const createParams: TransactionCreateInput = {
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
  const createParams: TransactionCreateInput[] = [
    {
      userId: "abc",
      date: new Date(2021, 1, 1).toISOString(),
      name: "McDonalds",
      amount: 12.5,
      type: "expenditure",
    },
    {
      userId: "abc",
      date: new Date(2021, 1, 1).toISOString(),
      name: "Waterstones",
      amount: 7.99,
      type: "expenditure",
    },
    {
      userId: "abc",
      date: new Date(2021, 11, 4).toISOString(),
      name: "Waterstones",
      amount: 25,
      type: "expenditure",
    },
    {
      userId: "abc",
      date: new Date(2020, 0, 1).toISOString(),
      name: "Waterstones",
      amount: 42,
      type: "expenditure",
    },
  ];

  for (const params of createParams) {
    await createTransaction(params);
  }

  const dailyAggregation = await listDailyTransactionAggregations({
    userId: "abc",
  });

  expect(dailyAggregation).toEqual({
    "2021-12-04": 25,
    "2021-02-01": 20.49,
    "2020-01-01": 42,
  });
});
