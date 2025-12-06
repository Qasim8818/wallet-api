// utils/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Wallet API',
            version: '1.0.0',
            description: 'A secure wallet management API',
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Development server' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./routes/*.js', './controllers/*.js'], // files containing annotations
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };