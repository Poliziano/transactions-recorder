import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  webServer: {
    command: "pnpm build && pnpm preview",
    port: 3000,
  },
  testDir: "tests/playwright",
};

export default config;
