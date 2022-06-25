import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { fromTransactionItem } from "../../entity/transaction";
import { db } from "../dynamo";

export type ListTransactionsInput = {
  userId: string;
};

export async function listTransactions({ userId }: ListTransactionsInput) {
  const command = new QueryCommand({
    TableName: "Transactions",
    IndexName: "GSI1",
    KeyConditionExpression: "GSI1PK = :PK and begins_with(GSI1SK, :SK)",
    ExpressionAttributeValues: {
      ":PK": `USER#${userId}`,
      ":SK": `TRANSACTION#`,
    },
    ScanIndexForward: false,
  });
  const response = await db.send(command);
  const items = response.Items ?? [];

  return items.map(fromTransactionItem);
}
