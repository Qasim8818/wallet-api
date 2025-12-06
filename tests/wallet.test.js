// tests/wallet.test.js – example integration tests

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); // make sure server.js exports app

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Wallet API', () => {
    let walletId;

    test('POST /api/v1/wallet creates wallet', async () => {
        const res = await request(app)
            .post('/api/v1/wallet')
            .send({ owner: 'test@example.com', balance: 100 })
            .expect(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.owner).toBe('test@example.com');
        walletId = res.body.data._id;
    });

    test('GET /api/v1/wallet/:id returns wallet', async () => {
        const res = await request(app).get(`/api/v1/wallet/${walletId}`).expect(200);
        expect(res.body.data.owner).toBe('test@example.com');
        expect(res.body.data.balance).toBe(100);
    });

    test('PUT /api/v1/wallet/:id/deposit', async () => {
        await request(app)
            .post(`/api/v1/wallet/${walletId}/deposit`)
            .send({ amount: 50 })
            .expect(200);
        const res = await request(app).get(`/api/v1/wallet/${walletId}`).expect(200);
        expect(res.body.data.balance).toBe(150);
    });
});