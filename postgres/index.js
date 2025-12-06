// postgres/index.js
// All functions you posted – written as async functions that use the shared pool.

const { pool } = require('../utils/postgres');
const logger = require('../utils/logger'); // reuse existing logger

// -------------------------------------------------------------------
// 1️⃣ createTable
async function createTable() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      age INT,
      city TEXT
    );
  `);
    logger.info('Table created.');
}

// -------------------------------------------------------------------
// 2️⃣ createIndex (simple email index)
async function createIndex() {
    await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_users_email
    ON users(email);
  `);
    logger.info('Index created.');
}

// -------------------------------------------------------------------
// 3️⃣ insertData (populate 100 000 rows)
async function insertData() {
    logger.info('Inserting rows…');
    for (let i = 0; i < 100_000; i++) {
        const email = `user${i}@gmail.com`;
        const age = Math.floor(Math.random() * 70);
        const city = i % 2 ? 'Karachi' : 'Lahore';
        await pool.query(
            'INSERT INTO users (email, age, city) VALUES ($1,$2,$3)',
            [email, age, city]
        );
    }
    logger.info('Done inserting rows.');
}

// -------------------------------------------------------------------
// 4️⃣ explainQuery
async function explainQuery() {
    const res = await pool.query(`
    EXPLAIN ANALYZE SELECT * FROM users WHERE email='user99999@gmail.com';
  `);
    console.log(res.rows.map(r => r['QUERY PLAN']).join('\n'));
}

// -------------------------------------------------------------------
// 5️⃣ fixIndex (drop & recreate)
async function fixIndex() {
    await pool.query('DROP INDEX IF EXISTS idx_users_email');
    await pool.query(`
    CREATE INDEX idx_users_email
    ON users(email);
  `);
    logger.info('Index fixed.');
}

// -------------------------------------------------------------------
// 6️⃣ createCompositeIndex (email + age)
async function createCompositeIndex() {
    await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_users_email_age
    ON users(email, age);
  `);
    logger.info('Composite index created.');
}

// -------------------------------------------------------------------
// 7️⃣ createPartialIndex (active = true)
async function createPartialIndex() {
    await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_active_users
    ON users(age)
    WHERE active = true;
  `);
    logger.info('Partial index created.');
}

// -------------------------------------------------------------------
// 8️⃣ queryNoIndex (benchmark without any index)
async function queryNoIndex() {
    console.time('query');
    const res = await pool.query('SELECT * FROM users WHERE age > 50');
    console.timeEnd('query');
    console.log(`Found ${res.rowCount} rows`);
}

// -------------------------------------------------------------------
// 9️⃣ setup (create table + 500 000 rows, variant schema)
async function setup() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT,
      age INT,
      bio TEXT
    );
  `);
    logger.info('Table created.');
    logger.info('Inserting rows...');
    for (let i = 0; i < 500_000; i++) {
        const email = `user${i}@gmail.com`;
        const age = Math.floor(Math.random() * 80);
        const bio = 'normal user';
        await pool.query(
            'INSERT INTO users (email, age, bio) VALUES ($1,$2,$3)',
            [email, age, bio]
        );
    }
    logger.info('Rows inserted.');
}

// -------------------------------------------------------------------
// 10️⃣ treeIndex (index on age + query)
async function treeIndex() {
    await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_users_age
    ON users(age);
  `);
    console.time('query');
    const res = await pool.query('SELECT * FROM users WHERE age > 50');
    console.timeEnd('query');
    console.log(`Found ${res.rowCount} rows`);
}

// -------------------------------------------------------------------
// 11️⃣ vacuumAnalyze
async function vacuumAnalyze() {
    await pool.query('VACUUM ANALYZE users');
    logger.info('VACUUM ANALYZE completed.');
}

// -------------------------------------------------------------------
// 12️⃣ writeBenchmark (random updates)
async function writeBenchmark() {
    const N = parseInt(process.env.N, 10) || 20_000;
    const ids = Array.from({ length: N }, () =>
        Math.floor(Math.random() * 100_000)
    );
    console.time('updates');
    for (const id of ids) {
        await pool.query('UPDATE users SET age = age + 1 WHERE id = $1', [id]);
    }
    console.timeEnd('updates');
}

// -------------------------------------------------------------------
// 13️⃣ populateCreateTable (drop + recreate with JSONB column)
async function populateCreateTable() {
    await pool.query(`
    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email TEXT,
      age INT,
      bio TEXT,
      data JSONB
    );
  `);
    logger.info('Table created (with JSONB).');
}

// -------------------------------------------------------------------
// 14️⃣ insertBatches (bulk insert, batch size = 5 000)
const TOTAL = parseInt(process.env.TOTAL, 10) || 500_000;
const BATCH = 5_000;

function randomBio(i) {
    return `bio for user ${i} ${Math.random().toString(36).slice(2)}`;
}
function randomJson(i) {
    const cities = [
        'Paris',
        'London',
        'NY',
        'Tokyo',
        'Karachi',
        'Delhi',
        'Beijing',
    ];
    const city = cities[i % cities.length];
    return JSON.stringify({
        city,
        tags: ['a', 'b', 'c'].slice(0, (i % 3) + 1),
        score: i % 100,
    });
}
async function insertBatches() {
    console.time('populate');
    for (let start = 0; start < TOTAL; start += BATCH) {
        const values = [];
        const params = [];
        let paramIdx = 1;
        const end = Math.min(start + BATCH, TOTAL);
        for (let i = start; i < end; i++) {
            const email = `user${i}@example.com`;
            const age = Math.floor(Math.random() * 80);
            const bio = randomBio(i);
            const data = randomJson(i);
            values.push(
                `($${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++})`
            );
            params.push(email, age, bio, data);
        }
        const sql = `INSERT INTO users (email, age, bio, data) VALUES ${values.join(
            ','
        )}`;
        await pool.query(sql, params);
        if ((start / BATCH) % 10 === 0) {
            console.log(`Inserted ${end} / ${TOTAL}`);
        }
    }
    console.timeEnd('populate');
}

// -------------------------------------------------------------------
// 15️⃣ populateRun (full workflow)
async function populateRun() {
    await populateCreateTable();
    await insertBatches();
    logger.info('Done population.');
}

// -------------------------------------------------------------------
// 16️⃣ bTreeIndexes (create a set of B‑Tree / GIN / partial indexes)
async function bTreeIndexes() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT,
      age INT,
      bio TEXT,
      data JSONB
    )
  `);
    await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true
  `);
    // B‑Tree
    await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_users_age ON users(age)
  `);
    // Composite
    await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_users_email_age ON users(email, age)
  `);
    // Partial (active = true)
    await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_active_users ON users(age) WHERE active = true
  `);
    // Covering index (age, email) – enables index‑only scans
    await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_users_covering ON users(age, email)
  `);
    // GIN on JSONB
    await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_users_json ON users USING GIN (data jsonb_path_ops)
  `);
    // Full‑text GIN on bio
    await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_users_fts ON users USING GIN (to_tsvector('english', bio))
  `);
    logger.info('All B‑Tree / GIN indexes created.');
}

// -------------------------------------------------------------------
// 17️⃣ gistIndexes (conditional GiST creation)
async function gistIndexes() {
    // Helper functions (re‑used from the original code)
    async function tableExists(name) {
        const r = await pool.query(
            `SELECT EXISTS (
         SELECT FROM pg_catalog.pg_class c
         JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
         WHERE c.relname = $1
       )`,
            [name]
        );
        return r.rows[0].exists;
    }
    async function columnExists(table, column) {
        const r = await pool.query(
            `SELECT EXISTS (
         SELECT 1
         FROM pg_catalog.pg_attribute a
         JOIN pg_catalog.pg_class c ON a.attrelid = c.oid
         WHERE c.relname = $1 AND a.attname = $2
           AND a.attnum > 0 AND NOT a.attisdropped
       )`,
            [table, column]
        );
        return r.rows[0].exists;
    }

    // Basic users table (same as bTreeIndexes)
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT,
      age INT,
      bio TEXT,
      data JSONB
    )
  `);
    // Ensure "active" column
    if (!(await columnExists('users', 'active'))) {
        await pool.query(`
      ALTER TABLE users ADD COLUMN active BOOLEAN DEFAULT true
    `);
    }

    // B‑Tree + GIN indexes (same as bTreeIndexes)
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_age ON users(age)`);
    await pool.query(
        `CREATE INDEX IF NOT EXISTS idx_users_email_age ON users(email, age)`
    );
    await pool.query(
        `CREATE INDEX IF NOT EXISTS idx_active_users ON users(age) WHERE active = true`
    );
    await pool.query(
        `CREATE INDEX IF NOT EXISTS idx_users_covering ON users(age, email)`
    );
    await pool.query(
        `CREATE INDEX IF NOT EXISTS idx_users_json ON users USING GIN (data jsonb_path_ops)`
    );
    await pool.query(
        `CREATE INDEX IF NOT EXISTS idx_users_fts ON users USING GIN (to_tsvector('english', bio))`
    );

    // Conditional GiST indexes
    if (await tableExists('locations') && (await columnExists('locations', 'geom'))) {
        await pool.query(
            `CREATE INDEX IF NOT EXISTS idx_locations_gist ON locations USING GiST(geom)`
        );
    }
    if (await tableExists('products') && (await columnExists('products', 'price_range'))) {
        await pool.query(
            `CREATE INDEX IF NOT EXISTS idx_price_range ON products USING GiST(price_range)`
        );
    }

    logger.info('All GiST/other indexes created (conditional).');
}

// -------------------------------------------------------------------
// Export everything for the router
module.exports = {
    createTable,
    createIndex,
    insertData,
    explainQuery,
    fixIndex,
    createCompositeIndex,
    createPartialIndex,
    queryNoIndex,
    setup,
    treeIndex,
    vacuumAnalyze,
    writeBenchmark,
    populateCreateTable,
    insertBatches,
    populateRun,
    bTreeIndexes,
    gistIndexes,
};