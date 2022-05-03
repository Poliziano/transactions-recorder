const { beforeAll, expect, test } = require("@jest/globals");
const cdk = require("aws-cdk-lib");
const { Template } = require("aws-cdk-lib/assertions");
const { TransactionsStack } = require("../lib/stack");

let template;

beforeAll(() => {
  const app = new cdk.App();
  const stack = new TransactionsStack(app, "test");
  template = Template.fromStack(stack);
});

test("should be defined", () => {
  expect(template).toBeDefined();
});