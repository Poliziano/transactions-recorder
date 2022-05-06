import { test, expect } from "@jest/globals";
import {
  createTransaction,
  TransactionCreateParams,
} from "../../lib/data/transactions";
import { handler } from "../../lib/lambda/transaction-get";
import { apiGatewayProxyEventFactory } from "./factory";

test("get transaction", async () => {
  const createParams: TransactionCreateParams = {
    userId: "some_id",
    date: new Date(2020, 0, 1),
    name: "McDonalds",
    amount: 12.5,
    type: "expenditure",
  };

  const transaction = await createTransaction(createParams);

  const event = apiGatewayProxyEventFactory.build({
    pathParameters: {
      userId: "some_id",
    },
  });
  const response = await handler(event);

  expect(response).toEqual({
    statusCode: 200,
    body: expect.any(String),
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
    },
  });
  expect(JSON.parse(response.body)).toEqual({
    transactions: [
      {
        userId: "some_id",
        name: "McDonalds",
        amount: 12.5,
        type: "expenditure",
        date: "2020-01-01T00:00:00.000Z",
        uuid: transaction.uuid,
      },
    ],
  });
});
