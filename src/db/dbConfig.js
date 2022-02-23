const databaseConfig = {
    user: 'sa',
    password: 'P@55word',
    server: 'localhost',
    database: 'guest_note',
    port: 1433,
    options: {
        trustServerCertificate: true
    }
};

module.exports = databaseConfig;