
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect('mongodb://localhost:27017/HEALTHCARE_FINANCE_TRACKER')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


  const patientIncomeSchema = new Schema({
      patientName: {
          type: String,
          required: true
      },
      fullPaymentReceived: {
          type: Boolean,
          required: true
      },
      paymentReceived: {
          type: Number,
          required: true
      },
      transactionDate: {
          type: Date,
          required: true
      },
      receipt: {
          type: String // URL or path to the file
      },
      patientBill: {
        type: String // URL or path to the file
    },

     date: {
        type: Date,
        default: Date.now
    }
  });
  
  const patientIncome = mongoose.model('patientIncome', patientIncomeSchema);
  
  module.exports = patientIncome;
  

