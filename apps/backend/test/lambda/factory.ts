import type { APIGatewayProxyEvent } from "aws-lambda";
import { Factory } from "fishery";

export const apiGatewayProxyEventFactory = Factory.define<APIGatewayProxyEvent>(
  () =>
    ({
      body: "",
      headers: {},
      multiValueHeaders: {},
      isBase64Encoded: false,
      httpMethod: "",
      path: "",
      pathParameters: null,
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
    } as APIGatewayProxyEvent)
);
