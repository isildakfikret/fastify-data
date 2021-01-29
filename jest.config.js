module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/test/*.test.ts'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest'
  }
};
