import { test, expect } from "@jest/globals";
import { handler } from "../../lib/lambda/transaction-create";
import { apiGatewayProxyEventFactory } from "./factory";

test("transaction-create should throw when invalid payload", async () => {
  // @ts-expect-error intentionally testing invalid event.
  const result = await handler();
  expect(result).toStrictEqual({
    statusCode: 400,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
});

test("transaction-create should throw when partial payload", async () => {
  const event = apiGatewayProxyEventFactory.build({
    body: JSON.stringify({
      date: new Date(2021, 1, 1),
      name: "McDonalds",
    }),
  });
  const result = await handler(event);

  expect(result).toStrictEqual({
    statusCode: 400,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
});

test("transaction-create should not thrown when valid payload", async () => {
  const event = apiGatewayProxyEventFactory.build({
    body: JSON.stringify({
      date: new Date(2021, 1, 1),
      name: "McDonalds",
      amount: 12.5,
      type: "expenditure",
    }),
    pathParameters: {
      userId: "a_user_id",
    },
  });
  const response = await handler(event);

  expect(response).toStrictEqual({
    statusCode: 200,
    body: expect.any(String),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  expect(JSON.parse(response.body!)).toEqual({
    userId: "a_user_id",
    name: "McDonalds",
    amount: 12.5,
    type: "expenditure",
    date: "2021-02-01T00:00:00.000Z",
    uuid: expect.any(String),
  });
});
