const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const db = new DynamoDBClient({
  endpoint: process.env.DYNAMO_ENDPOINT,
});

module.exports = { 
  db
};