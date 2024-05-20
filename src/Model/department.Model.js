"use strict";
const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: true
  },
  Company: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Company'
  }
});

departmentSchema.index({ departmentName: 1, Company: 1 }, { unique: true });

const DepartmentModel = mongoose.model('Department', departmentSchema);
module.exports = DepartmentModel;
    