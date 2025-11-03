const express = require('express');
const router = express.Router();
const {
  createTeam,
  getTeams,
  getTeam,
  joinTeam,
  leaveTeam,
  updateTeam,
  deleteTeam,
  removeMember
} = require('../controllers/teamController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getTeams)
  .post(protect, createTeam);

router.route('/:id')
  .get(protect, getTeam)
  .put(protect, updateTeam)
  .delete(protect, deleteTeam);

router.post('/:id/join', protect, joinTeam);
router.post('/:id/leave', protect, leaveTeam);
router.delete('/:id/members/:memberId', protect, removeMember);

module.exports = router;

