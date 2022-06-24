export {};

declare global {
  namespace jest {
    interface Expect {
      jsonMatching<TExpected>(expected: TExpected): CustomMatcherResult;
    }
  }
}

expect.extend({
  jsonMatching(actual: any, expected: any) {
    let pass = true;
    try {
      expect(JSON.parse(actual)).toMatchObject(expected);
    } catch (err) {
      pass = false;
    }

    return {
      pass,
      message: () =>
        `expected: ${JSON.stringify(
          expected,
          null,
          2
        )} but recieved ${JSON.stringify(actual, null, 2)}`,
    };
  },
});
