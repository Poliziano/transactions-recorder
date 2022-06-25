export {};

declare global {
  namespace jest {
    interface Expect {
      jsonMatching<TExpected>(expected: TExpected): any;
    }
  }
}

expect.extend({
  jsonMatching(actual: any, expected: any) {
    let pass = true;
    try {
      expect(JSON.parse(actual)).toMatchObject(expected);
    } catch (err) {
      console.warn("expected: ", JSON.stringify(expected, null, 2));
      console.warn("recieved: ", JSON.stringify(actual, null, 2));
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
