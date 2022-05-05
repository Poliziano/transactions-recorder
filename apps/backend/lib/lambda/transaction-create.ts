import { createTransaction } from "../data/transactions";
import { TransactionEntity } from "../entity/transaction-entity";
import type { APIGatewayProxyEvent } from "aws-lambda";

const Ajv = require("ajv").default;
const ajv = new Ajv();

const schema = {
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

const validate = ajv.compile(schema);

export async function handler(event: APIGatewayProxyEvent) {
  console.log("event", JSON.stringify(event, null, 2));

  try {
    const payload = Object.assign(JSON.parse(event.body ?? "{}"), {
      userId: event.pathParameters?.userId,
    });

    if (validate(payload)) {
      const date = new Date(payload.date);
      const entity = new TransactionEntity({
        ...payload,
        date: date,
        uuid: TransactionEntity.uuid(date),
      });
      await createTransaction(entity);

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
        },
      };
    } else {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
        },
      };
    }
  } catch (err) {
    console.error("failed to parse payload", JSON.stringify(err, null, 2));

    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    };
  }
}
