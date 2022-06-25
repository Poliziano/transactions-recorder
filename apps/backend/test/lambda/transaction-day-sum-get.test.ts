import { handler } from "../../lib/lambda/transaction-day-sum-get";
import {
  apiGatewayProxyEventFactory,
  lambdaContextFactory,
} from "../factories/api-gateway";
import {
  batchCreateTransactions,
  batchPutTransactions,
} from "../factories/transactions";
import randomUserId from "../factories/user-id";

const userId = randomUserId();

test.func(handler, [
  {
    name: "return list of transactions on date",
    input: [
      apiGatewayProxyEventFactory.build({
        pathParameters: {
          userId,
        },
      }),
      lambdaContextFactory.build(),
    ],
    expectedOutput: {
      statusCode: 200,
      body: expect.jsonMatching({
        aggregations: {
          "2021-12-04": 25,
          "2021-02-01": 20.49,
          "2020-01-01": 42,
        },
      }),
    },
    setup() {
      return batchCreateTransactions([
        {
          userId,
          date: new Date(2021, 1, 1).toISOString(),
          name: "McDonalds",
          amount: 12.5,
          type: "expenditure",
        },
        {
          userId,
          date: new Date(2021, 1, 1).toISOString(),
          name: "Waterstones",
          amount: 7.99,
          type: "expenditure",
        },
        {
          userId,
          date: new Date(2021, 11, 4).toISOString(),
          name: "Waterstones",
          amount: 25,
          type: "expenditure",
        },
        {
          userId,
          date: new Date(2020, 0, 1).toISOString(),
          name: "Waterstones",
          amount: 42,
          type: "expenditure",
        },
      ]);
    },
  },
]);
