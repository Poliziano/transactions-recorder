import { TransactionCanceledException } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import {
  fromTransactionItem,
  Transaction,
  transactionUUID,
} from "../entity/transaction";
import { fromTransactionAggregationItem } from "../entity/transaction-aggregation";
import { NewTransactionCommand } from "./commands/new-transaction-command";
import { db } from "./dynamo";

export type ListTransactionsParams = { userId: string };
export async function listTransactions({ userId }: ListTransactionsParams) {
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

export type ListTransactionsForDateParams = { userId: string; date: string };
export async function listTransactionsForDate({
  userId,
  date,
}: ListTransactionsForDateParams) {
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

export async function listDailyTransactionAggregations({
  userId,
}: ListTransactionsParams) {
  const command = new QueryCommand({
    TableName: "Transactions",
    KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
    ExpressionAttributeValues: {
      ":PK": `USER#${userId}`,
      ":SK": `SUM#`,
    },
    ScanIndexForward: false,
  });
  const response = await db.send(command);
  const items = response.Items ?? [];

  return items.map(fromTransactionAggregationItem);
}

export type TransactionCreateParams = Omit<Transaction, "uuid" | "date"> & {
  date: string;
};
export async function createTransaction(params: TransactionCreateParams) {
  const transaction: Transaction = {
    ...params,
    date: new Date(params.date),
    uuid: transactionUUID(),
  };

  try {
    await db.send(new NewTransactionCommand({ transaction, update: true }));
  } catch (err) {
    if (!(err instanceof TransactionCanceledException)) {
      console.log(JSON.stringify(err, null, 2));
      throw err;
    }

    await db.send(new NewTransactionCommand({ transaction, update: false }));
  }
  return transaction;
}

export type DeleteTransactionParams = {
  userId: string;
  transactionId: string;
};
export async function deleteTransaction({
  userId,
  transactionId,
}: DeleteTransactionParams) {
  const command = new DeleteCommand({
    TableName: "Transactions",
    Key: {
      PK: `USER#${userId}`,
      SK: `TRANSACTION#${transactionId}`,
    },
  });

  await db.send(command);
}
