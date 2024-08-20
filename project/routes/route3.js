const express = require('express');
const router = express.Router();
const PatientExpense = require('../models/patexp');
const patientIncome = require('../models/patinc');
const Budget = require('../models/Budget');
const Supply = require('../models/supplies');
const getDailyExpense = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
      const result = await Supply.aggregate([
          { $match: { date: { $gte: startOfDay, $lte: endOfDay } } },
          { $group: { _id: null, totalAmount: { $sum: "$amountBySuppliers" } } }
      ]);

      console.log('Daily Expense Result:', result); // Add this line
      return result[0] ? result[0].totalAmount : 0;
  } catch (err) {
      console.log(err);
      return 0;
  }
};


// Get Weekly Expense
const getWeeklyExpense = async () => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    try {
        const result = await Supply.aggregate([
            {
                $match: {
                    date: { $gte: startOfWeek, $lte: endOfWeek }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amountBySuppliers" }
                }
            }
        ]);

        return result[0] ? result[0].totalAmount : 0;
    } catch (err) {
        console.log(err);
        return 0;
    }
};

// Get Monthly Expense
const getMonthlyExpense = async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);
    endOfMonth.setDate(0); // Last day of the month
    endOfMonth.setHours(23, 59, 59, 999);

    try {
        const result = await Supply.aggregate([
            {
                $match: {
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amountBySuppliers" }
                }
            }
        ]);

        const totalAmount = result[0] ? result[0].totalAmount : 0;
        console.log('Monthly Total Amount:', totalAmount);
        return totalAmount; // Return the result for use in other functions
    } catch (err) {
        console.error('Error fetching monthly sum:', err);
        throw err; // Re-throw the error to be handled by the caller
    }
};

// Get Yearly Expense
const getYearlyExpense = async () => {
    const currentYear = new Date().getFullYear();

    const startOfYear = new Date(currentYear, 0, 1); // January 1st
    startOfYear.setHours(0, 0, 0, 0);

    const endOfYear = new Date(currentYear + 1, 0, 0); // December 31st
    endOfYear.setHours(23, 59, 59, 999);

    try {
        const result = await Supply.aggregate([
            {
                $match: {
                    date: { $gte: startOfYear, $lte: endOfYear }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amountBySuppliers" }
                }
            }
        ]);

        const totalAmount = result[0] ? result[0].totalAmount : 0;
        console.log('Yearly Total Amount:', totalAmount);
        return totalAmount;
    } catch (err) {
        console.error('Error fetching yearly sum:', err);
    }
};

// Get Daily Sum
const getDailySum = async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const result = await PatientExpense.aggregate([
            {
                $match: {
                    date: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalAmount" }
                }
            }
        ]);

        return result[0] ? result[0].totalAmount : 0;
    } catch (err) {
        console.log(err);
        return 0;
    }
};

// Get Weekly Sum
const getWeeklySum = async () => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    try {
        const result = await PatientExpense.aggregate([
            {
                $match: {
                    date: { $gte: startOfWeek, $lte: endOfWeek }
                }
            }, 
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalAmount" }
                }
            }
        ]);

        return result[0] ? result[0].totalAmount : 0;
    } catch (err) {
        console.log(err);
        return 0;
    }
};

// Get Monthly Sum
const getMonthlySum = async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);
    endOfMonth.setDate(0); // Last day of the month
    endOfMonth.setHours(23, 59, 59, 999);

    try {
        const result = await PatientExpense.aggregate([
            {
                $match: {
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalAmount" }
                }
            }
        ]);

        const totalAmount = result[0] ? result[0].totalAmount : 0;
        console.log('Monthly Total Amount:', totalAmount);
        return totalAmount;
    } catch (err) {
        console.error('Error fetching monthly sum:', err);
        throw err;
    }
};

// Get Yearly Sum
const getYearlySum = async () => {
    const currentYear = new Date().getFullYear();

    const startOfYear = new Date(currentYear, 0, 1); // January 1st
    startOfYear.setHours(0, 0, 0, 0);

    const endOfYear = new Date(currentYear + 1, 0, 0); // December 31st
    endOfYear.setHours(23, 59, 59, 999);

    try {
        const result = await PatientExpense.aggregate([
            {
                $match: {
                    date: { $gte: startOfYear, $lte: endOfYear }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalAmount" }
                }
            }
        ]);

        const totalAmount = result[0] ? result[0].totalAmount : 0;
        console.log('Yearly Total Amount:', totalAmount);
        return totalAmount;
    } catch (err) {
        console.error('Error fetching yearly sum:', err);
    }
};

// Get Daily Income
const getDailyIncome = async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const result = await patientIncome.aggregate([
            {
                $match: {
                    date: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$paymentRecieved" }
                }
            }
        ]);

        return result[0] ? result[0].totalAmount : 0;
    } catch (err) {
        console.log(err);
        return 0;
    }
};

// Get Weekly Income
const getWeeklyIncome = async () => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    try {
        const result = await patientIncome.aggregate([
            {
                $match: {
                    date: { $gte: startOfWeek, $lte: endOfWeek }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$paymentRecieved" }
                }
            }
        ]);

        return result[0] ? result[0].totalAmount : 0;
    } catch (err) {
        console.log(err);
        return 0;
    }
};

// Get Monthly Income
const getMonthlyIncome = async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);
    endOfMonth.setDate(0); // Last day of the month
    endOfMonth.setHours(23, 59, 59, 999);

    try {
        const result = await patientIncome.aggregate([
            {
                $match: {
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$paymentRecieved" }
                }
            }
        ]);

        const totalAmount = result[0] ? result[0].totalAmount : 0;
        console.log('Monthly Total Amount:', totalAmount);
        return totalAmount;
    } catch (err) {
        console.error('Error fetching monthly sum:', err);
        throw err;
    }
};

// Get Yearly Income
const getYearlyIncome = async () => {
    const currentYear = new Date().getFullYear();

    const startOfYear = new Date(currentYear, 0, 1); // January 1st
    startOfYear.setHours(0, 0, 0, 0);

    const endOfYear = new Date(currentYear + 1, 0, 0); // December 31st
    endOfYear.setHours(23, 59, 59, 999);

    try {
        const result = await patientIncome.aggregate([
            {
                $match: {
                    date: { $gte: startOfYear, $lte: endOfYear }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$paymentRecieved" }
                }
            }
        ]);

        const totalAmount = result[0] ? result[0].totalAmount : 0;
        console.log('Yearly Total Amount:', totalAmount);
        return totalAmount;
    } catch (err) {
        console.error('Error fetching yearly sum:', err);
    }
};

// Overall Expense Data Route
router.get('/overall-expense-data', async (req, res) => {
    try {
        const dailyExpense = await getDailyExpense()+getDailySum();;
        const weeklyExpense = await getWeeklyExpense()+ getWeeklySum();;
        const monthlyExpense = await getMonthlyExpense()+getMonthlySum();;
        const yearlyExpense = await getYearlyExpense()+getYearlySum();;
        const dailyIncome = await getDailyIncome();
        const weeklyIncome = await getWeeklyIncome();
        const monthlyIncome = await getMonthlyIncome();
        const yearlyIncome = await getYearlyIncome();

        // Fetch budgets for daily and weekly
// Fetch daily and weekly budgets for overall department
const dailyBudget = await Budget.findOne({ 
  budget_period: 'daily', 
  department: 'overall' 
});
const weeklyBudget = await Budget.findOne({ 
  budget_period: 'weekly', 
  department: 'overall' 
});
// Fetch daily and weekly budgets for overall department
const monthlyBudget = await Budget.findOne({ 
  budget_period: 'monthly', 
  department: 'overall' 
});
const yearlyBudget = await Budget.findOne({ 
  budget_period: 'yearly', 
  department: 'overall' 
});


const dailySum = await getDailySum();
console.log('Daily Sum:', dailySum);


        res.json({
           dailyExpense,
           weeklyExpense,
           monthlyExpense,
           yearlyExpense,
            dailyIncome,
            weeklyIncome,
            monthlyIncome,
            yearlyIncome,
            dailyBudget: dailyBudget ? dailyBudget.allocated_amount : 0,
            weeklyBudget: weeklyBudget ? weeklyBudget.allocated_amount : 0,
            monthlyBudget:   monthlyBudget ?   monthlyBudget.allocated_amount : 0,
            yearlyBudget: yearlyBudget? yearlyBudget.allocated_amount : 0
        });
    } catch (err) {
        console.error('Error fetching overall expense data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/overall',(req,res)=>{
  res.render('overall')
})

module.exports = router;
