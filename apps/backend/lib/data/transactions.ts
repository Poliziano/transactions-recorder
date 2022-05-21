import { db } from "./dynamo";
import { PutCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import {
  fromTransactionItem,
  toTransactionItem,
  Transaction,
} from "../entity/transaction";
import KSUID from "ksuid";

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
    uuid: uuid(params.date),
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
      SK: `ID#${transactionId}`,
    },
  });

  await db.send(command);
}

function uuid(date = new Date()) {
  const orderedId = KSUID.randomSync(Date.now()).string;
  const dateString = date.toISOString().split("T")[0];

  return `${dateString}:${orderedId}`;
}
