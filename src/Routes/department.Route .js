const express = require('express');
const droute = express.Router();
const departmentController = require('../Controller/department.Controller');
const Auth = require('../Middleware/auth.Middleware');


droute.post('/',Auth.roleCheck(['admin']), departmentController.addDepartment)



droute.get('/',Auth.roleCheck(['admin','user']), departmentController.showDepartment)

droute.get('/:id/employee', Auth.roleCheck(['admin','user']),departmentController.showDepartmentEmployees)


droute.delete('/:id',Auth.roleCheck(['admin']), departmentController.delDepartment)

droute.put('/:id', Auth.roleCheck(['admin']), departmentController.updateDepartment)


module.exports = droute