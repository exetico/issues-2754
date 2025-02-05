process.env.TZ = 'UTC';

export default {
	testEnvironment: 'jest-environment-node',
	transform: {},
	modulePathIgnorePatterns: ['<rootDir>/jest/spec/disabled']
};
