import type { Config } from "jest";

const base: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: { "^.+\\.ts$": "ts-jest" },
  moduleFileExtensions: ["ts", "js", "json"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  verbose: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/swagger/**",
    "!src/**/config/**"
  ],
};

const config: Config = {
  collectCoverage: true,
  coverageProvider: "v8",
  coverageReporters: ["text", "lcov", "cobertura"],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: { branches: 80, functions: 85, lines: 85, statements: 85 },
  },


  projects: [
    {
      ...base,
      displayName: "unit",
      testMatch: ["<rootDir>/tests/unit/**/*.spec.ts"],
    },
    {
      ...base,
      displayName: "integration",
      testMatch: ["<rootDir>/tests/integration/**/*.spec.ts"],
      setupFilesAfterEnv: ["<rootDir>/tests/integration/jest.setup.ts"],
    },
  ],
};

export default config;
