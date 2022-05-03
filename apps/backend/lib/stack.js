const { Stack } = require("aws-cdk-lib");
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const path = require("path");

class TransactionsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const transactionsTable = new dynamodb.Table(this, "Transactions", {
      partitionKey: {
        name: "PK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "SK",
        type: dynamodb.AttributeType.STRING,
      },
      tableName: "Transactions",
    });

    const lambdaTransactionGet = new TransactionsNodejsFunction(
      this,
      "TransactionGet",
      "transaction-get.js"
    );

    const lambdaTransactionCreate = new TransactionsNodejsFunction(
      this,
      "TransactionCreate",
      "transaction-create.js"
    );

    const lambdaTransactionDelete = new TransactionsNodejsFunction(
      this,
      "TransactionDelete",
      "transaction-delete.js"
    );

    transactionsTable.grantReadData(lambdaTransactionGet);
    transactionsTable.grantWriteData(lambdaTransactionCreate);
    transactionsTable.grantWriteData(lambdaTransactionDelete);

    const api = new apigateway.RestApi(this, "transactions");
    const transactionsResource = api.root
      .addResource("users")
      .addResource("{userId}")
      .addResource("transactions");

    transactionsResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(lambdaTransactionGet)
    );
    transactionsResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(lambdaTransactionCreate)
    );
    transactionsResource
      .addResource("{transactionId}")
      .addMethod(
        "DELETE",
        new apigateway.LambdaIntegration(lambdaTransactionDelete)
      );
  }
}

class TransactionsNodejsFunction extends NodejsFunction {
  constructor(scope, id, filename) {
    super(scope, id, {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "handler",
      entry: path.resolve(__dirname, "lambda", filename),
    });
  }
}

module.exports = { TransactionsStack };
