import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { fromTransactionItem } from "../../entity/transaction";
import { db } from "../dynamo";

export type ListTransactionsForDateInput = {
  userId: string;
  date: string;
};

export async function listTransactionsForDate({
  userId,
  date,
}: ListTransactionsForDateInput) {
  const command = new QueryCommand({
    TableName: "Transactions",
    IndexName: "GSI1",
    KeyConditionExpression: "GSI1PK = :PK and GSI1SK = :SK",
    ExpressionAttributeValues: {
      ":PK": `USER#${userId}`,
      ":SK": `TRANSACTION#${date}`,
    },
    ScanIndexForward: false,
  });
  const response = await db.send(command);
  const items = response.Items ?? [];

  return items.map(fromTransactionItem);
}
