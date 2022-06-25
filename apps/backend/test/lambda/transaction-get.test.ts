import { putTransaction } from "../../lib/data/transaction-repository";
import { handler } from "../../lib/lambda/transaction-get";
import {
  apiGatewayProxyEventFactory,
  lambdaContextFactory,
} from "../factories/api-gateway";
import randomUserId from "../factories/user-id";
import { func } from "../function-test";

const userId = randomUserId();

func(handler, [
  {
    name: "throw when invalid payload",
    input: [apiGatewayProxyEventFactory.build(), lambdaContextFactory.build()],
    expectedOutput: {
      statusCode: 400,
    },
  },
  {
    name: "get transactions",
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
        transactions: [
          {
            userId,
            uuid: "transaction_uuid",
            date: "2021-02-01T00:00:00.000Z",
            name: "McDonalds",
            amount: 12.5,
            type: "expenditure",
          },
        ],
      }),
    },
    async setup() {
      return putTransaction({
        userId,
        uuid: "transaction_uuid",
        date: new Date(2021, 1, 1),
        name: "McDonalds",
        amount: 12.5,
        type: "expenditure",
      });
    },
  },
]);
