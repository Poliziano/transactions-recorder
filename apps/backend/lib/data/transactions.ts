import { db } from "./dynamo";
import {
  PutItemCommand,
  QueryCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { TransactionEntity } from "../entity/transaction-entity";

type ListTransactionsParams = {
  userId: string;
};

export async function listTransactions({ userId }: ListTransactionsParams) {
  const command = new QueryCommand({
    TableName: "Transactions",
    KeyConditionExpression: "PK = :PK",
    ExpressionAttributeValues: {
      ":PK": {
        S: `USER#${userId}`,
      },
    },
    ScanIndexForward: false,
  });
  const response = await db.send(command);
  const items = response.Items ?? [];

  return items.map(TransactionEntity.from);
}

export async function createTransaction(entity: TransactionEntity) {
  const command = new PutItemCommand({
    TableName: "Transactions",
    Item: entity.toItem() as any,
  });

  await db.send(command);
}

export async function deleteTransaction(userId: string, transactionId: string) {
  const command = new DeleteItemCommand({
    TableName: "Transactions",
    Key: {
      PK: { S: `USER#${userId.toLowerCase()}` },
      SK: { S: `ID#${transactionId}` },
    },
  });

  await db.send(command);
}
