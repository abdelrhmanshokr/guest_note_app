const databaseConfig = {
    user: 'sa',
    password: 'P@55word',
    server: 'localhost',
    database: 'guest_note',
    port: 1433,
    connectionTimeout: 999999999,
    requestTimeout: 999999999,
    options: {
        trustServerCertificate: true
    }
};

module.exports = databaseConfig;