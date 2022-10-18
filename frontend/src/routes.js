const apiPath = '/api/v1';

export default {
  apiSigninPath: () => `${apiPath}/login`,
  apiDataPath: () => `${apiPath}/data`,
  apiSignupPath: () => `${apiPath}/signup`,
  signinPath: () => '/login',
  signupPath: () => '/signup',
  mainPath: () => '/',
};
