/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  verbose: true,
  injectGlobals: true,
  globalSetup: "<rootDir>/test/global-setup.ts",
  setupFilesAfterEnv: ["<rootDir>/test/env-setup.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
};
