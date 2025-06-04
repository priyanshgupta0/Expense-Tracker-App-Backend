const Expense = require('../models/Expense');
const Group = require('../models/Group');

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
exports.createExpense = async (req, res) => {
  try {
    const { description, amount, paidBy, splitBetween } = req.body;
    const groupId = req.params.groupId;

    // Verify group exists and user is a member
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const allMembersExist = splitBetween.every(userId => 
      group.members.some(member => member._id.toString() === userId)
    );

    if (!allMembersExist) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Create expense
    const expense = await Expense.create({
      description,
      amount,
      paidBy: paidBy || req.user._id,
      splitBetween: splitBetween.map(userId => ({ user: userId })),
      groupId
    });

    // Add expense to group
    group.expenses.push(expense._id);
    await group.save();

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all expenses for a group
// @route   GET /api/expenses/group/:groupId
// @access  Private
exports.getGroupExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ groupId: req.params.groupId })
      .populate('paidBy', 'name email')
      .populate('splitBetween.user', 'name email');

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Calculate balances for a group
// @route   GET /api/expenses/group/:groupId/balances
// @access  Private
// @desc    Get balance sheet for a group
// @route   GET /api/groups/:groupId/balance-sheet
// @access  Private
exports.calculateGroupBalances = async (req, res) => {
  try {
    const expenses = await Expense.find({ groupId: req.params.groupId })
      .populate('paidBy', 'name email')
      .populate('splitBetween.user', 'name email');

    const balances = {};

    // Calculate what each person has paid and owes
    expenses.forEach(expense => {
      const paidById = expense.paidBy._id.toString();
      const amountPerPerson = expense.amount / expense.splitBetween.length;

      // Initialize balances for payer if not exists
      if (!balances[paidById]) {
        balances[paidById] = {
          user: expense.paidBy,
          paid: 0,
          owes: 0,
          netBalance: 0
        };
      }

      // Add amount paid by payer
      balances[paidById].paid += expense.amount;

      // Calculate what each person owes
      expense.splitBetween.forEach(split => {
        const userId = split.user._id.toString();

        if (!balances[userId]) {
          balances[userId] = {
            user: split.user,
            paid: 0,
            owes: 0,
            netBalance: 0
          };
        }

        balances[userId].owes += amountPerPerson;
      });
    });

    // Calculate net balance for each person
    Object.keys(balances).forEach(userId => {
      balances[userId].netBalance = balances[userId].paid - balances[userId].owes;
    });

    res.json(Object.values(balances));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};