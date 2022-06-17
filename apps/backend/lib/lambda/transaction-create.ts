import {
  createTransaction,
  TransactionCreateParams,
} from "../data/transactions";
import type { APIGatewayProxyEvent } from "aws-lambda";

import Ajv, { JSONSchemaType } from "ajv";
const ajv = new Ajv();

const schema: JSONSchemaType<TransactionCreateParams> = {
  type: "object",
  properties: {
    userId: { type: "string" },
    date: { type: "string" },
    name: { type: "string" },
    amount: { type: "number" },
    type: { type: "string" },
  },
  required: ["userId", "date", "name", "amount", "type"],
  additionalProperties: false,
};

const validate = ajv.compile<TransactionCreateParams>(schema);

export async function handler(event: APIGatewayProxyEvent) {
  console.log("event", JSON.stringify(event, null, 2));

  try {
    const payload = Object.assign(JSON.parse(event.body ?? "{}"), {
      userId: event.pathParameters?.userId,
    });

    if (validate(payload)) {
      const transaction = await createTransaction(payload);

      return {
        statusCode: 200,
        body: JSON.stringify(transaction),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      };
    } else {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      };
    }
  } catch (err) {
    console.error("failed to parse payload", JSON.stringify(err, null, 2));

    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}
