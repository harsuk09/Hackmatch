const express = require('express');
const router = express.Router();
const {
  getUser,
  updateProfile,
  searchUsers,
  getUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getUsers);
router.get('/search', protect, searchUsers);
router.get('/:id', protect, getUser);
router.put('/profile', protect, updateProfile);

// Notifications
const { getNotifications, markNotificationRead } = require('../controllers/userController');
router.get('/notifications', protect, getNotifications);
router.post('/notifications/:notificationId/read', protect, markNotificationRead);

module.exports = router;

