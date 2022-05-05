module.exports = {
  tables: [
    {
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
    },
  ],
};
