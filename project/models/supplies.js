const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/HEALTHCARE_FINANCE_TRACKER')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

  const supplySchema = new mongoose.Schema({
    medicalSupplies: { type: String, required: true },
    supplyDescription: { type: String, required: true },
    dateOfTransaction: { type: Date, required: true},
   verificationStatus: { type: String, required: true},
    amountBySuppliers: { type: Number,required:true},
    departmentUnit: { type: String},
    productSuppliers: { type: String,required:true},
    invoice:{type:String},
    notes : {type: String,default:null}  ,
    date:{type:Date,default:Date.now}
  });
  

module.exports = mongoose.model('Supply', supplySchema);

