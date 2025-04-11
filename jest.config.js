/** @type {import('ts-jest').JestConfigWithTsJest} **/
// eslint-disable-next-line no-undef
module.exports = {
  testEnvironment: "node",
  transform: {
    // eslint-disable-next-line no-useless-escape
    "^.+\.tsx?$": ["ts-jest",{}],
  },
};