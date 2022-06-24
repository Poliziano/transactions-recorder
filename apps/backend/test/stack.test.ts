import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { BUNDLING_STACKS } from "aws-cdk-lib/cx-api";
import { TransactionsStack } from "../lib/stack";

let template: any;

beforeAll(() => {
  const app = new cdk.App({
    context: {
      [BUNDLING_STACKS]: Boolean(process.env.DISABLE_CDK_BUNDLING) ? [] : ["*"],
    },
  });
  const stack = new TransactionsStack(app, "test");
  template = Template.fromStack(stack);
});

test("should be defined", () => {
  expect(template).toBeDefined();
});
