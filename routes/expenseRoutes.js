const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createExpense,
  getGroupExpenses,
  calculateGroupBalances
} = require('../controllers/expenseController');

// Protect all routes
router.use(protect);

// Group expense routes
router.route('/groups/:groupId/expenses')
  .post(createExpense)
  .get(getGroupExpenses);

router.route('/groups/:groupId/balance-sheet')
  .get(calculateGroupBalances);

module.exports = router;