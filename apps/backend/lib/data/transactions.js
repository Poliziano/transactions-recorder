const { db } = require("./dynamo");
const { PutItemCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { TransactionEntity } = require("../entity/transaction-entity");

async function listTransactions({ userId }) {
  const command = new QueryCommand({
    TableName: "Transactions",
    KeyConditionExpression: "PK = :PK",
    ExpressionAttributeValues: {
      ":PK": {
        S: `USER#${userId}`
      }
    },
    ScanIndexForward: false
  });
  const response = await db.send(command);
  const items = response.Items ?? [];

  return items.map(TransactionEntity.from);
}

async function createTransaction(entity) {
  const command = new PutItemCommand({
    TableName: "Transactions",
    Item: entity.toItem()
  });

  await db.send(command);
}

module.exports = {
  listTransactions,
  createTransaction
}