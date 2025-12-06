// tests/wallet.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); // You'll need to export app from server.js

let mongoServer;
let authToken;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Wallet API', () => {
    test('POST /api/v1/wallet - create new wallet', async () => {
        const response = await request(app)
            .post('/api/v1/wallet')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ owner: 'test@example.com', balance: 1000 })
            .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.balance).toBe(1000);
    });

    test('GET /api/v1/wallet/:id - get wallet', async () => {
        // Implementation here
    });
});