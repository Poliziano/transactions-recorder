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
import { listTrainsactionsDailySum } from "../data/transactions/list-transactions-daily-sum";
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

async function transactionDaySumGetHandler(event: TransactionGetEvent) {
  const aggregations = await listTrainsactionsDailySum({
    userId: event.pathParameters.userId,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      aggregations,
    }),
  };
}

export const handler = middy(transactionDaySumGetHandler)
  .use(middleware)
  .use(validator({ inputSchema: validate, ajvInstance: ajv }));
