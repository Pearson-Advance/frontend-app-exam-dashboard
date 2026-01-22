module.exports =  {
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.js',
  ],

  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  coveragePathIgnorePatterns: [
    'src/setupTest.js',
    'src/i18n',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },

  transformIgnorePatterns: [
  '/node_modules/(?!(@edx|@openedx|react-paragon-topaz)/)',
],
};
