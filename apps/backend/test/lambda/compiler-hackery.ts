import { APIGatewayProxyEvent, Context } from "aws-lambda";

/**
 * This function does nothing. It only exists to convert the typed lambdas to the
 * vanilla event and context types.
 */
export default function untyped<
  THandler extends (event: any, context: Context) => any
>(
  handler: THandler
): (event: APIGatewayProxyEvent, context: Context) => ReturnType<THandler> {
  return handler;
}
