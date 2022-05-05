import { deleteTransaction } from "../data/transactions";

export async function handler(event: any) {
  console.log("event", JSON.stringify(event, null, 2));

  await deleteTransaction(
    event.pathParameters.userId,
    event.pathParameters.transactionId
  );

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
    },
  };
}
