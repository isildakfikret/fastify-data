module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['lcov'],
  moduleFileExtensions: ['ts', 'js'],
  testPathIgnorePatterns: ['node_modules', 'test/decorators.ts']
};
