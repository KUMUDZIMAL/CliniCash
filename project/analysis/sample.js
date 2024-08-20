const mongoose = require('mongoose');
const Supply = require('../models/supplies'); // Update the path

const getDailySum = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const result = await Supply.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay }
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


getDailySum();
const getWeeklySum = async () => {
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
      
      console.log('Weekly Total Amount:', result[0] ? result[0].totalAmount : 0);
    } catch (err) {
      console.log(err);
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
      
      console.log('Monthly Total Amount:', result[0] ? result[0].totalAmount : 0);
    } catch (err) {
      console.log(err);
    }
  };
  
  getMonthlySum();
  const getYearlySum = async () => {
    const currentYear = new Date().getFullYear();
    
    const startOfYear = new Date(currentYear, 0, 1); // January 1st of the current year
    startOfYear.setHours(0, 0, 0, 0);
  
    const endOfYear = new Date(currentYear + 1, 0, 0); // December 31st of the current year
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
      
      console.log('Yearly Total Amount:', result[0] ? result[0].totalAmount : 0);
    } catch (err) {
      console.log(err);
    }
  };
  
  getYearlySum();
      
  const express = require('express');
const router = express.Router();
router.get('/daily-sum', (req, res) => {
  res.sendFile(path.join(__dirname, 'chart.html')); // Assuming chart.html is in the views folder
});


router.post('/api/daily-sum', async (req, res) => {
  try {
    const dailyTotal = await getDailySum();
    res.json({ dailyTotal });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve daily sum' });
  }
});
module.exports=getDailySum

