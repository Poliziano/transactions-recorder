import middy from "@middy/core";
import validator from "@middy/validator";
import Ajv, { JSONSchemaType } from "ajv";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
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

async function transactionDaySumGetHandler(
  event: TransactionGetEvent
): Promise<APIGatewayProxyResult> {
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
