const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb");

let client;

const tableConfig = {
  TableName: "Transactions",
  KeySchema: [
    {
      KeyType: "HASH",
      AttributeName: "PK",
    },
    {
      KeyType: "RANGE",
      AttributeName: "SK",
    },
  ],
  AttributeDefinitions: [
    {
      AttributeType: "S",
      AttributeName: "PK",
    },
    {
      AttributeType: "S",
      AttributeName: "SK",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

async function getOrCreateDynamoClient() {
  if (client == null) {
    client = new DynamoDBClient({
      endpoint: "http://localhost:8090",
    });

    await client.send(new CreateTableCommand(tableConfig));
  }

  return client;
}

module.exports = {
  getOrCreateDynamoClient
}