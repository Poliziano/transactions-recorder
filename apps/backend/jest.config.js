/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  globalSetup: "./test/global-setup.ts",
  globalTeardown: "./test/global-teardown.ts",

  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
