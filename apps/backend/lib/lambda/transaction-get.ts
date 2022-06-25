import middy from "@middy/core";
import validator from "@middy/validator";
import Ajv, { JSONSchemaType } from "ajv";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { listTransactionsForDate } from "../data/transactions/list-transactions-for-date";
import middleware from "./middlware/common-middleware";

type TransactionGetEvent = Omit<APIGatewayProxyEvent, "pathParameters"> & {
  pathParameters: {
    userId: string;
    date: string;
  };
};

const schema: JSONSchemaType<Pick<TransactionGetEvent, "pathParameters">> = {
  type: "object",
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        userId: { type: "string" },
        date: { type: "string" },
      },
      required: ["userId", "date"],
      additionalProperties: false,
    },
  },
  required: ["pathParameters"],
};

const ajv = new Ajv();
const validate = ajv.compile<TransactionGetEvent>(schema);

async function transactionGetHandler(event: TransactionGetEvent) {
  const transactions = await listTransactionsForDate({
    userId: event.pathParameters.userId,
    date: event.pathParameters.date,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      transactions: transactions,
    }),
  };
}

export const handler = middy(transactionGetHandler)
  .use(middleware)
  .use(validator({ inputSchema: validate, ajvInstance: ajv }));
