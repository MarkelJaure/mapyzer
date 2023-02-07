require('dotenv').config();

module.exports = {

    // If using online database
    // development: {
    //   use_env_variable: 'DATABASE_URL'
    // },

    development: {
        database: process.env.DEV_DB_NAME,
        username: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASS,
        host: process.env.DEV_DB_HOST,
        port: process.env.DEV_DB_PORT,
        dialect: 'postgres'
    },

    test: {
        database: process.env.TEST_DB_NAME,
        username: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASS,
        host: process.env.TEST_DB_HOST,
        port: process.env.TEST_DB_PORT,
        dialect: 'postgres'
    },

    production: {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres'
    }
};
