import { test, expect } from "@jest/globals";
import {
  createTransaction,
  TransactionCreateParams,
} from "../../lib/data/transactions";
import { handler } from "../../lib/lambda/transaction-delete";
import { apiGatewayProxyEventFactory, lambdaContextFactory } from "./factory";
import { convertToApiGatewayLambda } from "./lambda-execute";

const transactionDeleteHandler = convertToApiGatewayLambda(handler);
const context = lambdaContextFactory.build();

test("delete transaction for user", async () => {
  const createParams: TransactionCreateParams = {
    userId: "some_user_id",
    date: new Date(2021, 0, 1).toISOString(),
    name: "McDonalds",
    amount: 12.5,
    type: "expenditure",
  };

  const transaction = await createTransaction(createParams);

  const event = apiGatewayProxyEventFactory.build({
    pathParameters: {
      userId: transaction.userId,
      transactionId: transaction.uuid,
    },
  });
  const response = await transactionDeleteHandler(event, context);

  expect(response).toMatchObject({
    statusCode: 200,
  });
});
