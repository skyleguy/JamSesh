module.exports = {
  preset: 'jest-preset-angular',
  // testRunner: 'jasmine2',
  // transformIgnorePatters: ['<rootDir>/node_modules/(?!library_name)'],
  transform: {
    "^.+\\.(ts|html)$": "jest-preset-angular",
    "^.+\\.js$": "babel-jest"
  },
  setupFilesAfterEnv: ['<rootDir>/setupJest.ts']
}