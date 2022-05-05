import { beforeAll, expect, test } from "@jest/globals";
import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { TransactionsStack } from "../lib/stack";

let template: any;

beforeAll(() => {
  const app = new cdk.App();
  const stack = new TransactionsStack(app, "test");
  template = Template.fromStack(stack);
});

test("should be defined", () => {
  expect(template).toBeDefined();
});
