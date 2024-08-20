const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/HEALTHCARE_FINANCE_TRACKER')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
  const Schema = mongoose.Schema;
// Define the Budget schema
const budgetSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    allocated_amount: {
        type: Schema.Types.Decimal128, // To handle decimal values accurately
        required: true
    },
    budget_period: {
        type: String,
        enum: ['daily', 'weekly', 'monthly','yearly'],
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    department: {
        type: String,
        enum: ['Supply', 'Facility', 'Patient', 'Staff','Other','overall'],
        default: 'Other'
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the model from the schema
const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
