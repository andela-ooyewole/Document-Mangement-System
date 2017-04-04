/* eslint-disable */
require('dotenv').config();
/* eslint-enable */

const envs = {
  development: {
    url: process.env.DEV_ENV_URL
  },
  test: {
    url: 'postgres://postgres:null@localhost:5432/dms_test'
  },
  production: {
    url: process.env.DATABASE_URL,
    use_env_variable: 'DATABASE_URL'
  }
};

module.exports = envs[process.env.NODE_ENV || 'test'];
