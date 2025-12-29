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
      branches: 0,
      functions: 5,
      lines: 3,
      statements: 3
    }
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        types: ['jest', 'node']
      }
    }]
  },
  moduleNameMapper: {
    '^../src/(.*)$': '<rootDir>/src/$1'
  }
};