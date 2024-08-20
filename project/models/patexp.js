

const mongoose = require('mongoose');
const {Schema}=mongoose
mongoose.connect('mongodb://localhost:27017/HEALTHCARE_FINANCE_TRACKER')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
const PatientExpenseSchema = new Schema({
    expenseCategory: {
      type: String,
      required: true,
    },
    expenseDescription: {
      type: String,
      required: true,
    },
    date:{
        type:Date,
        default:Date.now
    },
    dateOfExpense: {
      type: Date,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    invoiceNo: {
      type: Number,
      required: true,
    },
    invoice: {
      type: [String], // Array of file paths or URLs
    },
    patientBill:{
      type: [String],
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    insurance: {
        type:String,
        required: true,
    },
      insuranceAmount: {
        type: Number,
        default:null
      },
      insurancePaid: {
        type: Number,
        default:null
      },
      remainingInsuranceAmount: {
        type: Number,
        default:null
      },
    
   
  })
  
  module.exports = mongoose.model('PatientExpense', PatientExpenseSchema);
  