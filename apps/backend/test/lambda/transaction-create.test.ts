import { test, expect } from "@jest/globals";
import { handler } from "../../lib/lambda/transaction-create";
import { apiGatewayProxyEventFactory, lambdaContextFactory } from "./factory";

const context = lambdaContextFactory.build();

test("transaction-create should throw when invalid payload", async () => {
  const event = apiGatewayProxyEventFactory.build();
  const result = await handler(event, context);
  expect(result).toMatchObject({
    statusCode: 400,
  });
});

test("transaction-create should throw when partial payload", async () => {
  const event = apiGatewayProxyEventFactory.build({
    body: JSON.stringify({
      date: new Date(2021, 1, 1),
      name: "McDonalds",
    }),
  });
  const result = await handler(event, context);

  expect(result).toMatchObject({
    statusCode: 400,
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
  const response = await handler(event, context);

  expect(response).toMatchObject({
    statusCode: 200,
    body: expect.any(String),
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
