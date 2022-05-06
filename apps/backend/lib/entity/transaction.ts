import type { NativeAttributeValue } from "@aws-sdk/util-dynamodb";

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
    PK: `USER#${transaction.userId.toLowerCase()}`,
    SK: `ID#${transaction.uuid}`,
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
    uuid: item.SK.split("#")[1],
    userId: item.PK.split("#")[1],
    date: new Date(item.Date),
    name: item.Name,
    amount: item.Amount,
    type: item.Type,
  };
}
