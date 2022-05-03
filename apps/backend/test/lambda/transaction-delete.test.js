const { test, expect } = require("@jest/globals");
const { createTransaction } = require("../../lib/data/transactions");
const { TransactionEntity } = require("../../lib/entity/transaction-entity");
const { handler } = require("../../lib/lambda/transaction-delete");

test("delete transaction for user", async () => {
  const entityA = new TransactionEntity({
    uuid: "uuid_of_item_to_delete",
    userId: "some_user_id",
    date: new Date(2021, 0, 1),
    name: "McDonalds",
    amount: 12.5,
    type: "expenditure",
  });

  await createTransaction(entityA);

  const response = await handler({
    pathParameters: {
      userId: "some_user_id",
      transactionId: "uuid_of_item_to_delete",
    },
  });

  expect(response).toEqual({
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
    },
  });
});
