/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  coverageProvider: 'v8',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/rootReducer.ts',
    '**/slices/**/*',
    '!**/node_modules/**',
    '!**/*.test.{ts,tsx}'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@pages$': '<rootDir>/src/pages',
    '^@components$': '<rootDir>/src/components',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@slices$': '<rootDir>/src/services/slices',
    '^@selectors$': '<rootDir>/src/services/selectors',
    '^@selectors/(.*)$': '<rootDir>/src/services/selectors/$1'
  },
  testPathIgnorePatterns: ['/node_modules/', '/temp/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
