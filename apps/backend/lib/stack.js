const { Stack } = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const path = require("path");

class TransactionsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    new NodejsFunction(this, "TransactionGet", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "handler",
      entry: path.resolve(__dirname, "lambda", "transaction-get.js"),
    });
  }
}

module.exports = { TransactionsStack };