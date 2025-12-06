// utils/bloomFilter.js
// Fixed implementation using the bloom-filter package correctly
const BloomFilter = require('bloom-filter');

// Correct way to initialize the filter according to the package's expected format
const filter = new BloomFilter({
    vData: Buffer.alloc(1024, 0), // 1KB filter (adjust size as needed)
    nHashFuncs: 4,               // number of hash functions
    nTweak: 0,                   // tweak value (optional)
    nFlags: 0                    // flags (optional)
});

module.exports = {
    /** Add a wallet id (string) to the filter */
    add(id) {
        // Convert string to buffer for the bloom filter
        filter.insert(Buffer.from(id, 'utf8'));
    },

    /** Test if id *might* exist – false means definitely not */
    mightContain(id) {
        return filter.contains(Buffer.from(id, 'utf8'));
    },

    /** Re‑initialize (e.g., after a bulk load) */
    reset() {
        // Clear by creating a new filter
        filter.vData.fill(0);
    },
};