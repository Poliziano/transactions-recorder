import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../dynamo";

export type DeleteTransactionInput = {
  userId: string;
  transactionId: string;
};

export async function deleteTransaction({
  userId,
  transactionId,
}: DeleteTransactionInput) {
  const command = new DeleteCommand({
    TableName: "Transactions",
    Key: {
      PK: `USER#${userId}`,
      SK: `TRANSACTION#${transactionId}`,
    },
    ConditionExpression: "attribute_exists(#pk)",
    ExpressionAttributeNames: {
      "#pk": "PK",
    },
  });

  await db.send(command);
}
