import middy from "@middy/core";
import errorLogger from "@middy/error-logger";
import cors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpSecurityHeaders from "@middy/http-security-headers";
import inputOutputLogger from "@middy/input-output-logger";
import validator from "@middy/validator";
import Ajv, { JSONSchemaType } from "ajv";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { listTransactions } from "../data/transactions";
import { ApiGatewayLambda } from "./types";

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

export const handler: ApiGatewayLambda<typeof transactionGetHandler> = middy()
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(cors())
  .use(httpSecurityHeaders())
  .use(jsonBodyParser())
  .use(inputOutputLogger())
  .use(validator({ inputSchema: validate, ajvInstance: ajv }))
  .handler(transactionGetHandler);
