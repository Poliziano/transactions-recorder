const { test, expect } = require("@jest/globals");
const { createTransaction } = require("../lib/data/transactions");
const { TransactionEntity } = require("../lib/entity/transaction-entity");
const { handler } = require("../lib/lambda/transaction-get");

test("get transaction", async () => {
  const entity = new TransactionEntity({
    userId: "some_id",
    date: new Date(2020, 0, 1),
    name: "McDonalds",
    amount: 12.5,
    type: "expenditure",
  });

  await createTransaction(entity);

  const response = await handler({
    pathParameters: {
      userId: "some_id",
    },
  });

  expect(response).toEqual({
    statusCode: 200,
    body: JSON.stringify({
      transactions: [
        {
          userId: "some_id",
          name: "McDonalds",
          amount: 12.5,
          type: "expenditure",
          date: "2020-01-01T00:00:00.000Z",
        },
      ],
    }),
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
    },
  });
});
