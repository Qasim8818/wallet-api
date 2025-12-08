// routes/postgres.js – expose PostgreSQL demo functions

const express = require('express');
const {
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
} = require('../postgres/index');



const { asyncHandler } = require('../utils/helpers');

const router = express.Router();

/* Simple “GET /explain-query” example */
router.get('/explain-query', asyncHandler(explainQuery));

router.post('/create-table', asyncHandler(createTable));
router.post('/create-index', asyncHandler(createIndex));
router.post('/insert-data', asyncHandler(insertData));

router.post('/fix-index', asyncHandler(fixIndex));
router.post('/create-composite-index', asyncHandler(createCompositeIndex));
router.post('/create-partial-index', asyncHandler(createPartialIndex));

router.get('/query-no-index', asyncHandler(queryNoIndex));
router.post('/setup', asyncHandler(setup));
router.post('/tree-index', asyncHandler(treeIndex));
router.post('/vacuum-analyze', asyncHandler(vacuumAnalyze));
router.post('/write-benchmark', asyncHandler(writeBenchmark));

router.post('/populate-create-table', asyncHandler(populateCreateTable));
router.post('/populate-run', asyncHandler(populateRun));

router.post('/b-tree-indexes', asyncHandler(bTreeIndexes));
router.post('/gist-indexes', asyncHandler(gistIndexes));

module.exports = router;
// routes/postgres.js
