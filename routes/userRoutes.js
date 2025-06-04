const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  updateUserProfile,
  deleteUserAccount,
  getUsers
} = require('../controllers/userController');

// Protect all routes
router.use(protect);

// User routes
router.route('/profile')
  .put(updateUserProfile)
  .delete(deleteUserAccount);

// Admin routes
router.route('/')
  .get(getUsers);

module.exports = router;