// utils/postgres.js – PostgreSQL connection pool

const { Pool } = require('pg');
const { PG } = require('./config');

const pool = new Pool(PG);
module.exports = { pool };