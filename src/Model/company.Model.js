
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  }
});

const companyModel = mongoose.model('Company', companySchema);
module.exports = companyModel;
