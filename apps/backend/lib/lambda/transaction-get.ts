import { listTransactions } from "../data/transactions";
import type { APIGatewayProxyEvent } from "aws-lambda";

export async function handler(event: APIGatewayProxyEvent) {
  console.log("event", JSON.stringify(event, null, 2));

  const userId = event.pathParameters?.userId;

  if (userId == null) {
    throw new Error("userId required");
  }

  const transactions = await listTransactions({ userId });

  return {
    statusCode: 200,
    body: JSON.stringify({
      transactions: transactions,
    }),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
}
