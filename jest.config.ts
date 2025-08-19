import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 30000, 
  moduleFileExtensions: ["ts", "js", "json", "node"],
  roots: ["<rootDir>/tests"], 
  modulePaths: ["<rootDir>/src"], 
  collectCoverage: true, 
  coverageDirectory: "coverage", 
};

export default config;


