module.exports = {
  roots: ['./'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  moduleFileExtensions: ['ts', 'js'],
  testPathIgnorePatterns: ['node_modules', 'test/decorators.ts']
};
