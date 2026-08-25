module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  moduleFileExtensions: ['ts', 'js'],
  clearMocks: true,
};
