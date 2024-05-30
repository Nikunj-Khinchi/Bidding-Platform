const rateLimit = require('express-rate-limit');

// Create a general rate limiter middleware
const createRateLimiter = (options) => {
    return rateLimit({
        windowMs: options.windowMs || 15 * 60 * 1000, // default 15 minutes
        max: options.max || 100, // default max requests per windowMs
        message: options.message || "Too many requests, please try again later.",
    });
};

module.exports = { createRateLimiter };
