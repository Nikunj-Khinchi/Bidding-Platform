const express = require('express');
const { getNotifications, markAsRead } = require('../controllers/notificationController');
// const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getNotifications);
router.post('/mark-read', markAsRead);

module.exports = router;
