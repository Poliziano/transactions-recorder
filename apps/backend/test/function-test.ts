export type FuncTestCase<
  THandler extends (...args: any[]) => any,
  TOutput = ReturnType<THandler> extends Promise<infer THandlerPromise>
    ? THandlerPromise
    : ReturnType<THandler>
> = {
  name: string;
  input: Parameters<THandler>;
  expectedOutput: Partial<TOutput>;
  setup?: () => Promise<unknown> | void;
};

/**
 * Small wrapper around `test.each` that faciliates building a table of tests
 * for a function, with appropriate inputs and outputs, and optional setup if necessary.
 */
export function func<THandler extends (...args: any[]) => any>(
  functionUnderTest: THandler,
  cases: FuncTestCase<THandler>[]
) {
  test.each([...cases])("$name", async ({ input, expectedOutput, setup }) => {
    await setup?.();
    const output = await functionUnderTest(...input);
    expect(output).toMatchObject(expectedOutput);
  });
}
