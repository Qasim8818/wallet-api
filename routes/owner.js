// routes/owner.js - CORRECTED VERSION
const express = require('express');
const router = express.Router();

// Simple route for now - we'll add Trie functionality later
router.get('/search', (req, res) => {
    const { prefix } = req.query;

    if (!prefix) {
        return res.status(400).json({
            success: false,
            message: 'Prefix parameter is required'
        });
    }

    // For now, return empty results
    res.json({
        success: true,
        data: { results: [], prefix }
    });
});

// MAKE SURE THIS IS THE LAST LINE - exporting the router
module.exports = router;