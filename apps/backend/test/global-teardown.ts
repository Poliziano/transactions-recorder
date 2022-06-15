import { StartedTestContainer } from "testcontainers";

export default async function () {
  // @ts-expect-error
  const container: StartedTestContainer = globalThis.__DYNAMODB__;
  if (container) {
    await container.stop();
  }

  // @ts-expect-error
  delete globalThis.__DYNAMODB__;
}
