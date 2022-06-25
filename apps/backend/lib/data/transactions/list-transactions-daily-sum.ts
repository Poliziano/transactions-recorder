import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { fromTransactionAggregationItem } from "../../entity/transaction-aggregation";
import { db } from "../dynamo";

export type ListDailyTransactionAggregationsInput = {
  userId: string;
};

export async function listTrainsactionsDailySum({
  userId,
}: ListDailyTransactionAggregationsInput): Promise<Record<string, number>> {
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
    .reduce(
      (previous, current) => ({
        ...previous,
        ...current,
      }),
      {}
    );
}
