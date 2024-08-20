const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/HEALTHCARE_FINANCE_TRACKER')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

  const userSchema = new mongoose.Schema({
    NAME: { type: String, required: true },
    EMAIL: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null },
    resetToken: { type: String, default: null } // Add this line
  });
  

module.exports = mongoose.model('User', userSchema);

