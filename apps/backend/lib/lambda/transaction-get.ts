import { listTransactions } from "../data/transactions";

export async function handler(event: any) {
  console.log("event", JSON.stringify(event, null, 2));

  const transactions = await listTransactions({
    userId: event.pathParameters.userId,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      transactions: transactions,
    }),
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
    },
  };
}
