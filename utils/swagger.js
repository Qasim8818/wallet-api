// utils/swagger.js – Swagger/OpenAPI setup

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Wallet & PostgreSQL Demo API',
            version: '1.0.0',
            description:
                'Demo API showing MongoDB wallet ops and PostgreSQL index demos.',
        },
        servers: [{ url: 'http://localhost:3000' }],
    },
    apis: ['./routes/*.js', './controllers/*.js'], // Read JSDoc from these files
};

const specs = swaggerJsdoc(options);
module.exports = { swaggerUi, specs };