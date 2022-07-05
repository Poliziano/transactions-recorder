import errorLogger from "@middy/error-logger";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpSecurityHeaders from "@middy/http-security-headers";
import inputOutputLogger from "@middy/input-output-logger";
import cors from "@middy/http-cors";

const middleware = [
  cors(),
  errorLogger(),
  httpErrorHandler(),
  httpSecurityHeaders(),
  jsonBodyParser(),
  inputOutputLogger(),
];

export default middleware;
