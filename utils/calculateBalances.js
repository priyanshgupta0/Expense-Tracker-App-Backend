/**
 * Utility function to calculate balances between group members
 * @param {Array} expenses - Array of expense objects
 * @returns {Object} Settlement instructions and balances
 */

const calculateSettlements = (balances) => {
  // Convert balances object to array of {userId, amount}
  const balanceArray = Object.entries(balances).map(([userId, amount]) => ({
    userId,
    amount
  }));

  // Sort by amount (ascending for negative balances, descending for positive)
  const debtors = balanceArray.filter(b => b.amount < 0).sort((a, b) => a.amount - b.amount);
  const creditors = balanceArray.filter(b => b.amount > 0).sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let i = 0; // debtors index
  let j = 0; // creditors index

  while (i < debtors.length && j < creditors.length) {
    const debt = -debtors[i].amount;
    const credit = creditors[j].amount;
    const amount = Math.min(debt, credit);

    settlements.push({
      from: debtors[i].userId,
      to: creditors[j].userId,
      amount: Number(amount.toFixed(2))
    });

    debtors[i].amount += amount;
    creditors[j].amount -= amount;

    if (Math.abs(debtors[i].amount) < 0.01) i++;
    if (Math.abs(creditors[j].amount) < 0.01) j++;
  }

  return settlements;
};

const calculateBalances = (expenses) => {
  const balances = {};

  // Calculate net balance for each user
  expenses.forEach(expense => {
    const { paidBy, amount, splitBetween } = expense;
    const paidById = paidBy.toString();
    const splitAmount = amount / splitBetween.length;

    // Initialize balances
    if (!balances[paidById]) balances[paidById] = 0;
    splitBetween.forEach(userId => {
      if (!balances[userId.toString()]) balances[userId.toString()] = 0;
    });

    // Add amount to payer's balance
    balances[paidById] += amount;

    // Subtract split amount from each person's balance
    splitBetween.forEach(userId => {
      balances[userId.toString()] -= splitAmount;
    });
  });

  // Calculate settlement instructions
  const settlements = calculateSettlements(balances);

  return {
    balances,
    settlements
  };
};

module.exports = calculateBalances;