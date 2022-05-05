import { test, expect } from "@jest/globals";
import { createTransaction } from "../../lib/data/transactions";
import { TransactionEntity } from "../../lib/entity/transaction-entity";
import { handler } from "../../lib/lambda/transaction-get";

test("get transaction", async () => {
  const entity = new TransactionEntity({
    uuid: TransactionEntity.uuid(new Date()),
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
          uuid: entity.uuid,
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
