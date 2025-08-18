/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'tests/**/*.ts',
    'src/**/*.ts',
    '!tests/**/*.test.ts',
    '!src/**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        types: ['jest', 'node']
      }
    }
  },
  moduleNameMapper: {
    '^../src/(.*)$': '<rootDir>/src/$1'
  }
};