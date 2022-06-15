import { db } from "./dynamo";
import { PutCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import {
  fromTransactionItem,
  toTransactionItem,
  Transaction,
  transactionUUID,
} from "../entity/transaction";

type ListTransactionsParams = { userId: string };
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

  return items.map(fromTransactionItem);
}

export type TransactionCreateParams = Omit<Transaction, "uuid">;
export async function createTransaction(params: TransactionCreateParams) {
  const transaction: Transaction = {
    ...params,
    uuid: transactionUUID(params.date),
  };

  const command = new PutCommand({
    TableName: "Transactions",
    Item: toTransactionItem(transaction),
  });

  await db.send(command);
  return transaction;
}

export async function deleteTransaction(userId: string, transactionId: string) {
  const command = new DeleteCommand({
    TableName: "Transactions",
    Key: {
      PK: `USER#${userId.toLowerCase()}`,
      SK: transactionId,
    },
  });

  await db.send(command);
}
