const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createGroup,
  getGroups,
  getGroupById,
  addMember
} = require('../controllers/groupController');

// Protect all routes
router.use(protect);

// Group routes
router.route('/')
  .post(createGroup)
  .get(getGroups);

router.route('/:id')
  .get(getGroupById);

router.route('/:groupId/users')
  .post(addMember);

module.exports = router;