const express = require('express');
const router=express.Router()
const PatientExpense = require('../models/patexp')
const patientIncome= require('../models/patinc')
const Budget=require('../models/Budget')
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
  getDailySum();
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
  getWeeklySum();
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
          return totalAmount; // Return the result for use in other functions
      } catch (err) {
          console.error('Error fetching monthly sum:', err); // Improved error logging
          throw err; // Re-throw the error to be handled by the caller
      }
  };
  
    getMonthlySum();
    const getYearlySum = async () => {
      const currentYear = new Date().getFullYear();
      
      // Define start and end of the year
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
          
          // Return or further process the totalAmount if needed
          return totalAmount;
      } catch (err) {
          console.error('Error fetching yearly sum:', err);
          // Handle error as needed
      }
  };
  
  getYearlySum();
  router.get('/patientFinance', (req, res) => {
    res.render('patientFinance'); // Render the chart.ejs file
  });
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
            totalAmount: { $sum: "$paymentReceived" }
          }
        }
      ]);
  
      return result[0] ? result[0].totalAmount : 0;
    } catch (err) {
      console.log(err);
      return 0;
    }
  };
  getDailyIncome();
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
            totalAmount: { $sum: "$paymentReceived" }
          }
        }
      ]);
      
      return result[0] ? result[0].totalAmount : 0;
    } catch (err) {
      console.log(err);
      return 0;
    }
  };
  getWeeklyIncome();
    const getMonthlyIncome= async () => {
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
                      totalAmount: { $sum: "$paymentReceived" }
                  }
              }
          ]);
  
          const totalAmount = result[0] ? result[0].totalAmount : 0;
          console.log('Monthly Total Amount:', totalAmount);
          return totalAmount; // Return the result for use in other functions
      } catch (err) {
          console.error('Error fetching monthly sum:', err); // Improved error logging
          throw err; // Re-throw the error to be handled by the caller
      }
  };
  
    getMonthlyIncome();
    const getYearlyIncome = async () => {
      const currentYear = new Date().getFullYear();
      
      // Define start and end of the year
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
                      totalAmount: { $sum: "$paymentReceived" }
                  }
              }
          ]);
          
          const totalAmount = result[0] ? result[0].totalAmount : 0;
          console.log('Yearly Total Amount:', totalAmount);
          
          // Return or further process the totalAmount if needed
          return totalAmount;
      } catch (err) {
          console.error('Error fetching yearly sum:', err);
          // Handle error as needed
      }
  };
  getYearlyIncome();
  router.get('/patientFinance', (req, res) => {
    res.render('patientFinance'); // Render the chart.ejs file
  });
  router.get('/weekly', async (req, res) => {
    try {
        const weeklyTotal = await getWeeklySum(); 
        const weeklyTotalIncome = await getWeeklyIncome();
        const BUDGET_WEEKLY = await Budget.findOne({ 
            budget_period: 'weekly',
            department:'Patient'
        }).sort({ createdAt: -1 }); // Sort to get the most recent budget

        if (!BUDGET_WEEKLY) {
            return res.status(404).json({ error: 'Weekly budget not found' });
        }
        res.json({ 
            weeklyTotal, 
            weeklyAllocatedAmount: BUDGET_WEEKLY.allocated_amount,
            weeklyTotalIncome
        });
    } catch (err) {
        console.error('Error fetching weekly sum or budgets:', err);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

// Route to get monthly data
router.get('/monthly', async (req, res) => {
    try {
        const monthlyTotal = await getMonthlySum(); 
        const monthlyTotalIncome = await getMonthlyIncome(); 
        const BUDGET_MONTHLY = await Budget.findOne({ 
            budget_period: 'monthly',
             department:'Patient'
        }).sort({ createdAt: -1 }); // Sort to get the most recent budget

        if (!BUDGET_MONTHLY) {
            return res.status(404).json({ error: 'Monthly budget not found' });
        }
        res.json({ 
            monthlyTotal, 
            monthlyAllocatedAmount: BUDGET_MONTHLY.allocated_amount,
            monthlyTotalIncome
        });
    } catch (err) {
        console.error('Error fetching monthly sum or budgets:', err);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

// Route to get daily data
router.get('/daily', async (req, res) => {
    try {
        const dailyTotal = await getDailySum(); 
        const dailyTotalIncome = await getDailyIncome(); 
        const BUDGET_DAILY = await Budget.findOne({ 
            budget_period: 'daily',
             department:'Patient'
        }).sort({ createdAt: -1 }); // Sort to get the most recent budget

        if (!BUDGET_DAILY) {
            return res.status(404).json({ error: 'Daily budget not found' });
        }
        res.json({ 
            dailyTotal, 
            dailyAllocatedAmount: BUDGET_DAILY.allocated_amount,
            dailyTotalIncome
        });
    } catch (err) {
        console.error('Error fetching daily sum or budgets:', err);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

// Route to get yearly data
router.get('/yearly', async (req, res) => {
    try {
        const yearlyTotal = await getYearlySum(); 
        const yearlyTotalIncome = await getYearlyIncome(); // Corrected to getYearlyIncome()
        const BUDGET_YEARLY = await Budget.findOne({ 
            budget_period: 'yearly',
             department:'Patient'
        }).sort({ createdAt: -1 }); // Sort to get the most recent budget

        if (!BUDGET_YEARLY) {
            return res.status(404).json({ error: 'Yearly budget not found' });
        }
        res.json({ 
            yearlyTotal, 
            yearlyAllocatedAmount: BUDGET_YEARLY.allocated_amount,
            yearlyTotalIncome
        });
    } catch (err) {
        console.error('Error fetching yearly sum or budgets:', err);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});
    
 module.exports=router