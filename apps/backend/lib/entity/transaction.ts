import type { NativeAttributeValue } from "@aws-sdk/util-dynamodb";
import KSUID from "ksuid";

export type Transaction = {
  userId: string;
  name: string;
  amount: number;
  type: string;
  date: Date;
  uuid: string;
};

export function toTransactionItem(transaction: Transaction) {
  return {
    PK: transaction.userId,
    SK: transaction.uuid,
    Name: transaction.name,
    Amount: transaction.amount,
    Type: transaction.type,
    Date: transaction.date.toISOString(),
  };
}

export function fromTransactionItem(item: {
  [index: string]: NativeAttributeValue;
}): Transaction {
  return {
    uuid: item.SK,
    userId: item.PK,
    date: new Date(item.Date),
    name: item.Name,
    amount: item.Amount,
    type: item.Type,
  };
}

export function transactionUUID(dateOfTransaction: Date | string = new Date()) {
  const orderedId = KSUID.randomSync(Date.now()).string;
  const dateString = (
    dateOfTransaction instanceof Date
      ? dateOfTransaction.toISOString()
      : dateOfTransaction
  ).split("T")[0];

  return `DATE#${dateString}#ID#${orderedId}`;
}
