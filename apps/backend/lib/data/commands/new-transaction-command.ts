import {
  TransactWriteCommand,
  TransactWriteCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { toTransactionItem, Transaction } from "../../entity/transaction";

type NewTransactionInput = {
  transaction: Transaction;
  update: boolean;
};
export class NewTransactionCommand extends TransactWriteCommand {
  constructor({ transaction, update }: NewTransactionInput) {
    super(
      update
        ? transactionWithUpdate(transaction)
        : transactionWithCreate(transaction)
    );
  }
}

function transactionWithCreate(
  transaction: Transaction
): TransactWriteCommandInput {
  return {
    TransactItems: [
      {
        Put: {
          TableName: "Transactions",
          Item: toTransactionItem(transaction),
          ConditionExpression: "attribute_not_exists(#pk)",
          ExpressionAttributeNames: {
            "#pk": "PK",
          },
        },
      },
      {
        Put: {
          TableName: "Transactions",
          Item: {
            PK: `USER#${transaction.userId}`,
            SK: `SUM#${transaction.date.getUTCFullYear()}`,
            Entries: {
              [transaction.date.toISOString().split("T")[0]]:
                transaction.amount,
            },
          },
          ConditionExpression: "attribute_not_exists(SK)",
        },
      },
    ],
  };
}

function transactionWithUpdate(
  transaction: Transaction
): TransactWriteCommandInput {
  return {
    TransactItems: [
      {
        Put: {
          TableName: "Transactions",
          Item: toTransactionItem(transaction),
          ConditionExpression: "attribute_not_exists(#pk)",
          ExpressionAttributeNames: {
            "#pk": "PK",
          },
        },
      },
      {
        Update: {
          TableName: "Transactions",
          Key: {
            PK: `USER#${transaction.userId}`,
            SK: `SUM#${transaction.date.getUTCFullYear()}`,
          },
          UpdateExpression: "ADD #entries.#date :entry",
          ConditionExpression: "attribute_exists(#entries)",
          ExpressionAttributeNames: {
            "#entries": "Entries",
            "#date": transaction.date.toISOString().split("T")[0],
          },
          ExpressionAttributeValues: {
            ":entry": transaction.amount,
          },
        },
      },
    ],
  };
}
