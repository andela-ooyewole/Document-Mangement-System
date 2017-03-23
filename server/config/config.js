require('dotenv').config();

const envs = {
  development: {
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
    host: '127.0.0.1',
    dialect: 'postgres'
  }
};

module.exports = envs[process.env.NODE_ENV || 'development'];
