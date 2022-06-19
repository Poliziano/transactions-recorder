import { APIGatewayProxyEvent, Context } from "aws-lambda";

export function convertToApiGatewayLambda<
  THandler extends (event: any, context: Context) => any
>(handler: THandler) {
  return handler as (
    event: APIGatewayProxyEvent,
    context: Context
  ) => ReturnType<THandler>;
}
