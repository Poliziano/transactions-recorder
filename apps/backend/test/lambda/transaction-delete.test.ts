import { test, expect } from "@jest/globals";
import { createTransaction } from "../../lib/data/transactions";
import { TransactionEntity } from "../../lib/entity/transaction-entity";
import { handler } from "../../lib/lambda/transaction-delete";
import { apiGatewayProxyEventFactory } from "./factory";

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

  const event = apiGatewayProxyEventFactory.build({
    pathParameters: {
      userId: "some_id",
      transactionId: "uuid_of_item_to_delete",
    },
  });
  const response = await handler(event);

  expect(response).toEqual({
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
    },
  });
});
