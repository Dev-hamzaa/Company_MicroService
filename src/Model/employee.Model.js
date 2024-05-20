"use strict";
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  Person: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    required: true,
    ref: 'Person'
  },
  Company: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Company'
  },
  Department: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Department'
  },
  Salary: {
    type: Number,
    required: true,
  }
});

const EmployeeModel = mongoose.model('Employee', employeeSchema);
module.exports = EmployeeModel;
