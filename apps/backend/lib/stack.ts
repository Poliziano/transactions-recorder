import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import path from "path";

export class TransactionsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
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
      "transaction-get.ts"
    );

    const lambdaTransactionAggregationGet = new TransactionsNodejsFunction(
      this,
      "TransactionAggregationGet",
      "transaction-aggregation-get.ts"
    );

    const lambdaTransactionCreate = new TransactionsNodejsFunction(
      this,
      "TransactionCreate",
      "transaction-create.ts"
    );

    const lambdaTransactionDelete = new TransactionsNodejsFunction(
      this,
      "TransactionDelete",
      "transaction-delete.ts"
    );

    transactionsTable.grantReadData(lambdaTransactionGet);
    transactionsTable.grantReadData(lambdaTransactionAggregationGet);
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
      .addResource("aggregations")
      .addMethod(
        "GET",
        new apigateway.LambdaIntegration(lambdaTransactionAggregationGet)
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
  constructor(scope: any, id: string, filename: string) {
    super(scope, id, {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "handler",
      entry: path.resolve(__dirname, "lambda", filename),
    });
  }
}
