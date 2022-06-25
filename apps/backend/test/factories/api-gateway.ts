import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { Factory } from "fishery";

export const apiGatewayProxyEventFactory = Factory.define<APIGatewayProxyEvent>(
  () => {
    const event: Partial<APIGatewayProxyEvent> = {
      body: "{}",
      headers: {
        "Content-Type": "application/json",
      },
      httpMethod: "ANY",
    };

    return event as APIGatewayProxyEvent;
  }
);

export const lambdaContextFactory = Factory.define<Context>(() => {
  const context: Partial<Context> = {};
  return context as Context;
});
