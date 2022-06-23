import { expect, test } from "@jest/globals";
import {
  createTransaction,
  TransactionCreateInput,
} from "../../lib/data/transaction-repository";
import { handler } from "../../lib/lambda/transaction-get";
import { apiGatewayProxyEventFactory, lambdaContextFactory } from "./factory";

const context = lambdaContextFactory.build();

test("get transaction", async () => {
  const createParams: TransactionCreateInput = {
    userId: "some_id",
    date: new Date(2020, 0, 1).toISOString(),
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

  const response = await handler(event, context);

  expect(response).toMatchObject({
    statusCode: 200,
    body: expect.any(String),
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
