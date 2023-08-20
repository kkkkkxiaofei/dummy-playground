// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharedConfig = require('./jest.config.js');
module.exports = {
  ...sharedConfig,
  testMatch: ['**/*.spec.ts'],
  testTimeout: 10000,
  collectCoverageFrom: ['lib/**/*.ts'],
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
