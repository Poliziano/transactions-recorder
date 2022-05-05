import { test, expect } from "@jest/globals";
import { handler } from "../../lib/lambda/transaction-create";

test("transaction-create should throw when invalid payload", async () => {
  // @ts-ignore
  const result = await handler();
  expect(result).toStrictEqual({
    statusCode: 400,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Origin": "*",
    },
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
    statusCode: 400,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Origin": "*",
    },
  });
});

test("transaction-create should not thrown when valid payload", async () => {
  const result = await handler({
    body: JSON.stringify({
      date: new Date(2021, 1, 1),
      name: "McDonalds",
      amount: 12.5,
      type: "expenditure",
    }),
    pathParameters: {
      userId: "user_id",
    },
  });

  expect(result).toStrictEqual({
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
