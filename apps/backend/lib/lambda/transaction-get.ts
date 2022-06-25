import middy from "@middy/core";
import validator from "@middy/validator";
import Ajv, { JSONSchemaType } from "ajv";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { listTransactions } from "../data/transactions/list-transactions";
import middleware from "./middlware/common-middleware";

type TransactionGetEvent = Omit<APIGatewayProxyEvent, "pathParameters"> & {
  pathParameters: {
    userId: string;
  };
};

const schema: JSONSchemaType<Pick<TransactionGetEvent, "pathParameters">> = {
  type: "object",
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        userId: { type: "string" },
      },
      required: ["userId"],
      additionalProperties: false,
    },
  },
  required: ["pathParameters"],
};

const ajv = new Ajv();
const validate = ajv.compile<TransactionGetEvent>(schema);

async function transactionGetHandler(event: TransactionGetEvent) {
  const transactions = await listTransactions({
    userId: event.pathParameters.userId,
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
