const express = require('express');
const router = express.Router();
const {
  createHackathon,
  getHackathons,
  getHackathon,
  updateHackathon,
  deleteHackathon,
  joinHackathon,
  leaveHackathon
} = require('../controllers/hackathonController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getHackathons)
  .post(protect, createHackathon);

router.route('/:id')
  .get(protect, getHackathon)
  .put(protect, updateHackathon)
  .delete(protect, deleteHackathon);

router.post('/:id/join', protect, joinHackathon);
router.post('/:id/leave', protect, leaveHackathon);

module.exports = router;

