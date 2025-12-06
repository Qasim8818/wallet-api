// seed.js
// Populate the database with demo wallets and ensure indexes are created.

const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');

// Wallet schema (same as in controller)
const walletSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
}, { timestamps: true });

// Create indexes
walletSchema.index({ owner: 1 });
walletSchema.index({ balance: -1 });
walletSchema.index({ owner: 1, balance: -1 });
walletSchema.index({ createdAt: -1 });

const Wallet = mongoose.model('Wallet', walletSchema);

async function run() {
    try {
        await mongoose.connect(config.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info('MongoDB connected for seeding');

        // Ensure indexes are created
        await Wallet.init();
        logger.info('Database indexes ensured');

        // Clear existing data
        await Wallet.deleteMany({});
        logger.info('Existing wallets cleared');

        // Demo data
        const demoWallets = [
            { owner: 'alice@example.com', balance: 1500 },
            { owner: 'bob@example.com', balance: 300 },
            { owner: 'charlie@example.com', balance: 0 },
            { owner: 'diana@example.com', balance: 2500 },
            { owner: 'alice@example.com', balance: 500 }, // Second wallet for Alice
        ];

        await Wallet.insertMany(demoWallets);
        logger.info(`${demoWallets.length} demo wallets inserted`);

        process.exit(0);
    } catch (err) {
        logger.error('Seeding error', err);
        process.exit(1);
    }
}

run();