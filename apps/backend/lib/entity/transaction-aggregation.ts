import type { NativeAttributeValue } from "@aws-sdk/util-dynamodb";

export type TransactionAggregation<T> = {
  userId: string;
  type: string;
  year: number;
  entries: {
    [date: string]: T;
  };
};

export function toTransactionAggregationItem(
  transaction: TransactionAggregation<any>
) {
  return {
    PK: `USER#${transaction.userId}`,
    SK: `${transaction.type}#${transaction.year}`,
    Entries: transaction.entries,
  };
}

export function fromTransactionAggregationItem<T>(item: {
  [date: string]: NativeAttributeValue;
}): TransactionAggregation<T> {
  return {
    userId: item.PK.split("#")[1],
    type: item.SK.split("#")[0],
    year: +item.SK.split("#")[1],
    entries: item.Entries,
  };
}
