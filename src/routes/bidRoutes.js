const express = require('express');
const { check } = require('express-validator');
const { getBids, createBid, deleteBid } = require('../controllers/bidController');
const authMiddleware = require('../middleware/authMiddleware');
const { createRateLimiter } = require('../middleware/rateLimitMiddleware');
const router = express.Router();

// Apply rate limiting middleware
const bidCreationLimiter = createRateLimiter({
    windowMs:  2 * 60 * 1000, // 15 minutes
    max: 10, // limit to 10 requests per windowMs for bid creation
    message: {error :"Too many bid creation attempts, please try again later."},
});

router.get('/:itemId/bids', getBids);
router.post('/:itemId/bids', bidCreationLimiter, authMiddleware, [
    check('bid_amount').isDecimal(),
], createBid);
router.delete('/:itemId/bids/:id', authMiddleware, deleteBid);

module.exports = router;
