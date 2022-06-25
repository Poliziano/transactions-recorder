import middy from "@middy/core";
import validator from "@middy/validator";
import Ajv, { JSONSchemaType } from "ajv";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { deleteTransaction } from "../data/transactions/delete-transaction";
import middleware from "./middlware/common-middleware";

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

export const handler = middy(transactionDeleteHandler)
  .use(middleware)
  .use(validator({ inputSchema: validate, ajvInstance: ajv }));
