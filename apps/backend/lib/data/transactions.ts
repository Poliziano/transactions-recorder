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

export type ListTransactionsInput = { userId: string };
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

export type ListTransactionsForDateInput = { userId: string; date: string };
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

export type ListDailyTransactionAggregationsInput = {
  userId: string;
};
export type ListDailyTransactionAggregationsOutput = Record<string, number>;
export async function listDailyTransactionAggregations({
  userId,
}: ListDailyTransactionAggregationsInput): Promise<ListDailyTransactionAggregationsOutput> {
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

  const aggregationsByYear = items.map(fromTransactionAggregationItem<number>);
  return aggregationsByYear
    .flatMap((year) =>
      Object.entries(year.entries).map(([key, value]) => ({ [key]: value }))
    )
    .reduce((previous, current) => ({
      ...previous,
      ...current,
    }));
}

export type TransactionCreateInput = Omit<Transaction, "uuid" | "date"> & {
  date: string;
};
export async function createTransaction(params: TransactionCreateInput) {
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
  });

  await db.send(command);
}
