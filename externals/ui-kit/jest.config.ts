import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  roots: ["<rootDir>/src"],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverageFrom: [
    "<rootDir>/src/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!node_modules",
    "!**/mock/**",
    "!**/__mocks__/**",
    "!**/fixture/**",
  ],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js"],
  modulePathIgnorePatterns: ["mocks", "fixture"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "identity-obj-proxy",
    "^~/(.*)$": "<rootDir>/src/$1",
  },
};
export default config;
