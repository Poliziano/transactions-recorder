import { putTransaction } from "../../lib/data/transaction-repository";
import { handler } from "../../lib/lambda/transaction-delete";
import {
  apiGatewayProxyEventFactory,
  lambdaContextFactory,
} from "../factories/api-gateway";
import randomUserId from "../factories/user-id";
import { func } from "../function-test";

const userId = randomUserId();

func(handler, [
  {
    name: "delete transaction for user",
    input: [
      apiGatewayProxyEventFactory.build({
        pathParameters: {
          userId,
          transactionId: "transaction_uuid",
        },
      }),
      lambdaContextFactory.build(),
    ],
    expectedOutput: {
      statusCode: 200,
    },
    setup() {
      return putTransaction({
        userId,
        uuid: "transaction_uuid",
        date: new Date(2021, 0, 1),
        name: "McDonalds",
        amount: 12.5,
        type: "expenditure",
      });
    },
  },
]);
