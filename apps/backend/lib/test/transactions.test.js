const { test, expect } = require('@jest/globals');
const { ListTablesCommand } = require("@aws-sdk/client-dynamodb");
const { db } = require("../data/dynamo");
const { listTransactions, createTransaction } = require('../data/transactions');
const { TransactionEntity } = require('../entity/transaction-entity');

test("should have table named Transactions", async () => {
  const list = new ListTablesCommand({});
  const result = await db.send(list);

  expect(result.TableNames).toStrictEqual(["Transactions"]);
}); 

test("should respond with empty list of transactions", async () => {
  const transactions = await listTransactions({ userId: "user_unknown"});
  expect(transactions).toStrictEqual([]);
});

test("should respond with list of transactions", async () => {
  const entityA = new TransactionEntity({
    userId: "abc",
    date: new Date(2021, 1, 1),
    name: "McDonalds",
    amount: 12.50,
    type: "expenditure",
  });

  const entityB = new TransactionEntity({
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