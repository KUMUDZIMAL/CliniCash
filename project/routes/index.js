const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('./users'); // Ensure this path is correct
const dotenv = require('dotenv');
const auth = require('../middlewares/authMiddleware');
const HUNTER_API_KEY = "2d30d33a749cac2aaa41d0c2e5cd6fbdd7d5aaf0";
const PatientExpense = require('../models/patexp')
const Supply = require('../models/supplies')
const Budget =require('../models/Budget')
const patientIncome =require('../models/patinc')
const REFRESH_TOKEN_SECRET_MIDDLEWARE = require('../middlewares/refreshAccessToken')
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('./generateKeys')
dotenv.config();

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
        
        // Return or further process the totalAmount if needed
        return totalAmount;
    } catch (err) {
        console.error('Error fetching yearly sum:', err);
        // Handle error as needed
    }
};

getYearlySum();
      
// Corrected GET route
router.get('/chart', (req, res) => {
  res.render('chart'); // Render the chart.ejs file
});
router.get('/budget', (req, res) => {
  res.render('budget'); // Render the chart.ejs file
});

// Route to provide the daily sum data for the chart
// Define route to provide monthly sum data
router.get('/weekly-sum', async (req, res) => {
  try {
    const weeklyTotal = await getWeeklySum(); 
    const BUDGET_WEEKLY = await Budget.findOne({ 
      budget_period: 'weekly',
       department:'Supply'
    }).sort({ createdAt: -1 }); // Sort to get the most recent budget

    if (!BUDGET_WEEKLY) {
      return res.status(404).json({ error: 'Weekly budget not found' });
    }
    res.json({ 
      weeklyTotal, 
      weeklyAllocatedAmount: BUDGET_WEEKLY.allocated_amount,
    });
  } catch (err) {
    console.error('Error fetching weekly sum or budgets:', err);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});
router.get('/monthly-sum', async (req, res) => {
  try {
      const monthlyTotal = await getMonthlySum(); 
      const BUDGET_MONTHLY = await Budget.findOne({ 
          budget_period: 'monthly',
           department:'Supply'
      }).sort({ createdAt: -1 }); // Sort to get the most recent budget

      if (!BUDGET_MONTHLY) {
          return res.status(404).json({ error: 'Monthly budget not found' });
      }
      res.json({ 
          monthlyTotal, 
          monthlyAllocatedAmount: BUDGET_MONTHLY.allocated_amount,
      });
  } catch (err) {
      console.error('Error fetching monthly sum or budgets:', err);
      res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

router.get('/daily-sum', async (req, res) => {
  try {
    const dailyTotal = await getDailySum(); 
    const BUDGET_DAILY = await Budget.findOne({ 
      budget_period: 'daily',
       department:'Supply'
    }).sort({ createdAt: -1 }); // Sort to get the most recent budget

    if (!BUDGET_DAILY) {
      return res.status(404).json({ error: 'daily  budget not found' });
    }
    res.json({ 
      dailyTotal, 
      dailyAllocatedAmount: BUDGET_DAILY.allocated_amount,
    });
  } catch (err) {
    console.error('Error fetching daily sum or budgets:', err);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});
router.get('/yearly-sum', async (req, res) => {
  try {
    const yearlyTotal = await getYearlySum(); 
    const BUDGET_YEARLY= await Budget.findOne({ 
      budget_period: 'yearly',
       department:'Supply'
    }).sort({ createdAt: -1 }); // Sort to get the most recent budget

    if (!BUDGET_YEARLY) {
      return res.status(404).json({ error: 'Yearly budget not found' });
    }
    res.json({ 
      yearlyTotal, 
      yearlyAllocatedAmount: BUDGET_YEARLY.allocated_amount,
    });
  } catch (err) {
    console.error('Error fetching yearly sum or budgets:', err);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

router.post('/budget', async (req, res) => {
  try {
    console.log(req.body)
    const { category,allocated_amount,budget_period,start_date,end_date,department
   } = req.body;

    const budget = new Budget( { 
      category,allocated_amount,budget_period,start_date,end_date,department});

    await budget.save();
    res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred while saving the data.' });
  }
})



router.get('/', (req, res) => res.render('home'));
router.get('/about', (req, res) => res.render('about'));
router.get('/services', auth, REFRESH_TOKEN_SECRET_MIDDLEWARE, (req, res, next) => res.render('services'));
router.get('/contact',  (req, res) => res.render('contact'));
router.get('/help', (req, res) => res.render('help'));
router.get('/patientinc', (req, res) => res.render('patinc'));
router.post('/patientinc', async (req, res) => {
  try {
    console.log(req.body)

   const{patientName,
    fullPaymentReceived,
    paymentReceived,
    transactionDate,
    receipt,
    patientBill} = req.body;

    const income = new patientIncome( {patientName,
      fullPaymentReceived,
      paymentReceived,
      transactionDate,
      receipt,
      patientBill  });

    await income.save();
    res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred while saving the data.' });
  }
})
router.get('/patientexp', (req, res) => res.render('patexp'));
router.post('/patientexp', async (req, res) => {
  try {
    console.log(req.body)
    const { expenseCategory,
    expenseDescription,
   
    dateOfExpense,
    department,
    invoiceNo,
    totalAmount,
 insurance,
    insuranceAmount,
        insurancePaid,
        remainingInsuranceAmount
   } = req.body;

    const expense = new PatientExpense( { expenseCategory,
      expenseDescription,
     
      dateOfExpense,
      department,
      invoiceNo,
      totalAmount,
    
      insurance,
        insuranceAmount,
        insurancePaid,
        remainingInsuranceAmount });

    await expense.save();
    res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred while saving the data.' });
  }
})
router.get('/supply',(req,res)=>{
  res.render('supply')
})
router.post('/supply', async (req, res) => {
  try {
    const { medicalSupplies,supplyDescription,
      dateOfTransaction,verificationStatus,
      amountBySuppliers,departmentUnit,
      productSuppliers,notes } = req.body;

    const supply = new Supply({ medicalSupplies,supplyDescription,
      dateOfTransaction,verificationStatus,
      amountBySuppliers,departmentUnit,
      productSuppliers,notes });

    await supply.save();
    res.status(200).json("Registered Successfully")

  } catch (err) {
    console.log(err)
  }
})

// Signup route
router.get('/signup', (req, res) => res.render('signup'));
router.get('/login', (req, res) => res.render('login'));

router.post('/signup', async (req, res) => {
  try {
    const { NAME, EMAIL, username, password } = req.body;

    console.log('Received data:', req.body);

    if (!NAME || !EMAIL || !username || !password) {
      return res.status(400).json({ message: 'All details are required' });
    }

    const existingUser = await User.findOne({ EMAIL });
    if (existingUser) {
      return res.status(400).json({ message: 'Account with this Email already exists' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'This username is not available' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ NAME, EMAIL, username, password: hashedPassword });

    await user.save();
    const token = jwt.sign({ username: user.username, id: user._id }, ACCESS_TOKEN_SECRET)
    res.cookie('token', token, { httpOnly: true });

    res.redirect('/login')
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate tokens

// Login route
// Move to env variable in production

// Login route
// Forgot password request route
const axios = require('axios');

// Forgot password request route
router.get('/forgotPassword', async (req, res) => {
  res.render('forgotPassword')

})
router.post('/forgot-password', async (req, res) => {
  try {
    const { EMAIL } = req.body;

    if (!EMAIL) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Verify email with Hunter.io
    const response = await axios.get(`https://api.hunter.io/v2/email-verifier?email=${EMAIL}&api_key=${HUNTER_API_KEY}`);
    const emailValid = response.data.data.result === 'deliverable';

    if (!emailValid) {
      return res.status(400).json({ message: 'Email does not exist or is not deliverable' });
    }

    const user = await User.findOne({ EMAIL });
    if (!user) {
      return res.status(400).json({ message: 'No user found with this email' });
    }

    // Generate a reset token
    const resetToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: '1h' });

    // Save the reset token in the user document
    user.resetToken = resetToken;
    await user.save();

    // Send reset email
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user.EMAIL,
        pass: user.password
      }
    });

    await transporter.sendMail({
      to: user.EMAIL,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the following link to reset your password: ${resetUrl}`
    });

    res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Reset password route
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }

    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.resetToken !== token) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password and save it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined; // Remove the reset token

    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', username);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate access and refresh tokens
    const accessToken = jwt.sign({ id: user._id, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id, username: user.username }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Update user with new refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Set access token in HTTP-only cookie
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
      sameSite: 'Strict'
    });

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 604800000, // 7 days
      sameSite: 'Strict'
    });

    // Redirect to the homepage
    res.redirect('/');
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: err.message });
  }
});



router.get('/logout', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ msg: 'Refresh token is missing.' });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    if (!decoded) {
      return res.status(401).json({ msg: 'Invalid refresh token.' });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ msg: 'User not found or refresh token mismatch.' });
    }

    // Remove the refresh token from the user document
    user.refreshToken = undefined; // Remove the field
    await user.save();

    res.clearCookie('jwt');
    res.clearCookie('refreshToken');

    res.status(200).redirect('/');
  } catch (err) {
    if (err.code === 11000) {
      console.error('Duplicate key error during logout:', err);
      return res.status(500).json({ msg: 'Duplicate key error' });
    }
    console.error('Error during logout:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});



module.exports = router;
