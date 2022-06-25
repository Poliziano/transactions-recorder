import middy from "@middy/core";
import validator from "@middy/validator";
import Ajv, { JSONSchemaType } from "ajv";
import type { APIGatewayProxyEvent } from "aws-lambda";
import {
  createTransaction,
  TransactionCreateInput,
} from "../data/transactions/create-transaction";
import middleware from "./middlware/common-middleware";

type TransactionCreateEvent = Omit<
  APIGatewayProxyEvent,
  "body" | "pathParameters"
> & {
  rawBody: string;
  body: Omit<TransactionCreateInput, "userId">;
  pathParameters: {
    userId: string;
  };
};

const schema: JSONSchemaType<
  Pick<TransactionCreateEvent, "body" | "pathParameters">
> = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        date: { type: "string" },
        name: { type: "string" },
        amount: { type: "number" },
        type: { type: "string" },
      },
      required: ["date", "name", "amount", "type"],
      additionalProperties: false,
    },
    pathParameters: {
      type: "object",
      properties: {
        userId: { type: "string" },
      },
      required: ["userId"],
      additionalProperties: false,
    },
  },
  required: ["body", "pathParameters"],
};

const ajv = new Ajv();
const validate = ajv.compile<TransactionCreateInput>(schema);
async function transactionCreateHandler(event: TransactionCreateEvent) {
  const transaction = await createTransaction({
    ...event.body,
    userId: event.pathParameters?.userId,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(transaction),
  };
}

export const handler = middy(transactionCreateHandler)
  .use(middleware)
  .use(validator({ inputSchema: validate, ajvInstance: ajv }));
