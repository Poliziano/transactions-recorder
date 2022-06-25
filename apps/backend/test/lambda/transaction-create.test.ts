import { handler } from "../../lib/lambda/transaction-create";
import {
  apiGatewayProxyEventFactory,
  lambdaContextFactory,
} from "../factories/api-gateway";
import randomUserId from "../factories/user-id";

const userId = randomUserId();

test.func(handler, [
  {
    name: "throw when invalid payload",
    input: [apiGatewayProxyEventFactory.build(), lambdaContextFactory.build()],
    expectedOutput: {
      statusCode: 400,
    },
  },
  {
    name: "throw when partial payload",
    input: [
      apiGatewayProxyEventFactory.build({
        body: JSON.stringify({
          date: new Date(2021, 1, 1),
          name: "McDonalds",
        }),
      }),
      lambdaContextFactory.build(),
    ],
    expectedOutput: {
      statusCode: 400,
    },
  },
  {
    name: "not throw when valid payload",
    input: [
      apiGatewayProxyEventFactory.build({
        body: JSON.stringify({
          date: new Date(2021, 1, 1),
          name: "McDonalds",
          amount: 12.5,
          type: "expenditure",
        }),
        pathParameters: {
          userId,
        },
      }),
      lambdaContextFactory.build(),
    ],
    expectedOutput: {
      statusCode: 200,
      body: expect.jsonMatching({
        userId,
        name: "McDonalds",
        amount: 12.5,
        type: "expenditure",
        date: "2021-02-01T00:00:00.000Z",
        uuid: expect.any(String),
      }),
    },
  },
]);
