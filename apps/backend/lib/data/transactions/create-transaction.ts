import { TransactionCanceledException } from "@aws-sdk/client-dynamodb";
import { Transaction, transactionUUID } from "../../entity/transaction";
import { NewTransactionCommand } from "../commands/new-transaction-command";
import { db } from "../dynamo";

export type TransactionCreateInput = Omit<Transaction, "uuid" | "date"> & {
  date: string;
};

export function createTransaction(params: TransactionCreateInput) {
  const transaction: Transaction = {
    ...params,
    date: new Date(params.date),
    uuid: transactionUUID(),
  };

  return putTransaction(transaction);
}

export async function putTransaction(transaction: Transaction) {
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
