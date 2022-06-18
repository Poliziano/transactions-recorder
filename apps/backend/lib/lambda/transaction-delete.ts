import { deleteTransaction } from "../data/transactions";
import type { APIGatewayProxyEvent, Context } from "aws-lambda";
import middy from "@middy/core";
import errorLogger from "@middy/error-logger";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpSecurityHeaders from "@middy/http-security-headers";
import inputOutputLogger from "@middy/input-output-logger";
import validator from "@middy/validator";
import Ajv, { JSONSchemaType } from "ajv";
import cors from "@middy/http-cors";

type TransactionDeleteEvent = Omit<APIGatewayProxyEvent, "pathParameters"> & {
  pathParameters: {
    userId: string;
    transactionId: string;
  };
};

const schema: JSONSchemaType<Pick<TransactionDeleteEvent, "pathParameters">> = {
  type: "object",
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        userId: { type: "string" },
        transactionId: { type: "string" },
      },
      required: ["userId"],
      additionalProperties: false,
    },
  },
  required: ["pathParameters"],
};

const ajv = new Ajv();
const validate = ajv.compile<TransactionDeleteEvent>(schema);

async function transactionDeleteHandler(event: TransactionDeleteEvent) {
  await deleteTransaction({
    userId: event.pathParameters.userId,
    transactionId: event.pathParameters.transactionId,
  });

  return {
    statusCode: 200,
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
  // @ts-expect-error `.handler` exists but it missing from type definitions.
  .handler(transactionDeleteHandler);
