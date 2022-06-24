import { handler } from "../../lib/lambda/transaction-create";
import { apiGatewayProxyEventFactory, lambdaContextFactory } from "./factory";

test.each([
  {
    name: "throw when invalid payload",
    event: apiGatewayProxyEventFactory.build(),
    expected: {
      statusCode: 400,
    },
  },
  {
    name: "throw when partial payload",
    event: apiGatewayProxyEventFactory.build({
      body: JSON.stringify({
        date: new Date(2021, 1, 1),
        name: "McDonalds",
      }),
    }),
    expected: {
      statusCode: 400,
    },
  },
  {
    name: "not throw when valid payload",
    event: apiGatewayProxyEventFactory.build({
      body: JSON.stringify({
        date: new Date(2021, 1, 1),
        name: "McDonalds",
        amount: 12.5,
        type: "expenditure",
      }),
      pathParameters: {
        userId: "a_user_id",
      },
    }),
    expected: {
      statusCode: 200,
      body: expect.jsonMatching({
        userId: "a_user_id",
        name: "McDonalds",
        amount: 12.5,
        type: "expenditure",
        date: "2021-02-01T00:00:00.000Z",
        uuid: expect.any(String),
      }),
    },
  },
])("$name", async ({ event, expected }) => {
  const response = await handler(event, lambdaContextFactory.build());
  expect(response).toMatchObject(expected);
});
