import {
  createTransaction,
  TransactionCreateParams,
} from "../data/transactions";
import type { APIGatewayProxyEvent } from "aws-lambda";
import Ajv, { JSONSchemaType } from "ajv";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import httpErrorHandler from "@middy/http-error-handler";
import errorLogger from "@middy/error-logger";
import inputOutputLogger from "@middy/input-output-logger";
import httpSecurityHeaders from "@middy/http-security-headers";
import cors from "@middy/http-cors";

type TransactionCreateEvent = Omit<
  APIGatewayProxyEvent,
  "body" | "pathParameters"
> & {
  rawBody: string;
  body: Omit<TransactionCreateParams, "userId">;
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
const validate = ajv.compile<TransactionCreateParams>(schema);
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

export const handler = middy<APIGatewayProxyEvent>()
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(cors())
  .use(httpSecurityHeaders())
  .use(jsonBodyParser())
  .use(inputOutputLogger())
  .use(validator({ inputSchema: validate, ajvInstance: ajv }))
  .handler(transactionCreateHandler);
