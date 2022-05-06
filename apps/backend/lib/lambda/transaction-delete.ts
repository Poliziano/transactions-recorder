import { deleteTransaction } from "../data/transactions";
import type { APIGatewayProxyEvent } from "aws-lambda";

export async function handler(event: APIGatewayProxyEvent) {
  console.log("event", JSON.stringify(event, null, 2));

  const userId = event.pathParameters?.userId;
  const transactionId = event.pathParameters?.transactionId;

  if (userId == null) {
    throw new Error("userId required");
  }

  if (transactionId == null) {
    throw new Error("transactionId required");
  }

  await deleteTransaction(userId, transactionId);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
}
