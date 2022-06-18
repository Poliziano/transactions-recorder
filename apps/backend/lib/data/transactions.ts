import { TransactionCanceledException } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import {
  fromTransactionItem,
  Transaction,
  transactionUUID,
} from "../entity/transaction";
import { NewTransactionCommand } from "./commands/new-transaction-command";
import { db } from "./dynamo";

type ListTransactionsParams = { userId: string };
export async function listTransactions({ userId }: ListTransactionsParams) {
  const command = new QueryCommand({
    TableName: "Transactions",
    KeyConditionExpression: "PK = :PK",
    ExpressionAttributeValues: {
      ":PK": userId,
    },
    ScanIndexForward: false,
  });
  const response = await db.send(command);
  const items = response.Items ?? [];

  return items.map(fromTransactionItem);
}

export type TransactionCreateParams = Omit<Transaction, "uuid" | "date"> & {
  date: string;
};
export async function createTransaction(params: TransactionCreateParams) {
  const transaction: Transaction = {
    ...params,
    date: new Date(params.date),
    uuid: transactionUUID(params.date),
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

export async function deleteTransaction(userId: string, transactionId: string) {
  const command = new DeleteCommand({
    TableName: "Transactions",
    Key: {
      PK: userId,
      SK: transactionId,
    },
  });

  await db.send(command);
}
