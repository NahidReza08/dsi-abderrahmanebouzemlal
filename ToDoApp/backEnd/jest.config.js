export default {
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};