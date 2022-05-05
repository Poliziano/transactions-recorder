import { db } from "./dynamo";
import { PutCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { TransactionEntity } from "../entity/transaction-entity";

type ListTransactionsParams = {
  userId: string;
};

export async function listTransactions({ userId }: ListTransactionsParams) {
  const command = new QueryCommand({
    TableName: "Transactions",
    KeyConditionExpression: "PK = :PK",
    ExpressionAttributeValues: {
      ":PK": `USER#${userId}`,
    },
    ScanIndexForward: false,
  });
  const response = await db.send(command);
  const items = response.Items ?? [];

  return items.map(TransactionEntity.from);
}

export async function createTransaction(entity: TransactionEntity) {
  const command = new PutCommand({
    TableName: "Transactions",
    Item: entity.toItem(),
  });

  await db.send(command);
}

export async function deleteTransaction(userId: string, transactionId: string) {
  const command = new DeleteCommand({
    TableName: "Transactions",
    Key: {
      PK: `USER#${userId.toLowerCase()}`,
      SK: `ID#${transactionId}`,
    },
  });

  await db.send(command);
}
