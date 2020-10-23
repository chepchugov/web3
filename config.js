module.exports = {
    port: process.env.WEB3_PORT,
    sessionSecret: process.env.WEB3_SESSION_SECRET,
    mongodb: {
        connectionString: process.env.WEB3_MONGODB_CONNECTION_STRING
    }
};