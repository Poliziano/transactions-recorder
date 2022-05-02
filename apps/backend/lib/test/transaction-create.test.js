const { test, expect } = require("@jest/globals");
const { handler } = require("../lambda/transaction-create");

test("transaction-create should throw when invalid payload", async () => {
  const result = await handler();
  expect(result).toStrictEqual({
    statusCode: 400
  });
});

test("transaction-create should throw when partial payload", async () => {
  const result = await handler({
    body: JSON.stringify({
      date: new Date(2021, 1, 1),
      name: "McDonalds",
    }),
  });

  expect(result).toStrictEqual({
    statusCode: 400
  });
});

test("transaction-create should not thrown when valid payload", async () => {
  const result = await handler({
    body: JSON.stringify({
      date: new Date(2021, 1, 1),
      name: "McDonalds",
      amount: 12.50,
      type: "expenditure",
    }),
    pathParameters: {
      userId: "user_id"
    }
  });

  expect(result).toStrictEqual({
    statusCode: 200
  });
});