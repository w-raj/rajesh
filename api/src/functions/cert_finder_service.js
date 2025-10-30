const { app } = require('@azure/functions');
const { sql } = require ('mssql');

app.http('cert_finder_service', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        const param = req.query.serial_number || (req.body && req.body.seria_number);
        if (!param) {
            context.res = {
                status: 400,
                body: "Missing query parameter 'serial_number'."
            };
            return;
        }
        
        const config = {
            user: 'hisoftec',
            password: 'Mansi2100$',
            server: 'hisoftec.database.windows.net', // e.g., 'yourserver.database.windows.net'
            database: 'hisoftec',
            options: {
                encrypt: true, // Required for Azure
                trustServerCertificate: false
            }
        };

        try {
            await sql.connect(config);
            const result = await sql.query`SELECT * FROM Cert_Data WHERE serial_number = ${param}`;
            context.res = {
                status: 200,
                body: result.recordset
            };
        } catch (err) {
            context.log.error("Database query failed:", err);
            context.res = {
                status: 500,
                body: "Error querying the database."
            };
        }
    }
});
