import { APIGatewayProxyEvent, Context } from "aws-lambda";

export type ApiGatewayLambda<THandler extends (...args: any[]) => any> = (
  event: APIGatewayProxyEvent,
  context: Context
) => ReturnType<THandler>;
