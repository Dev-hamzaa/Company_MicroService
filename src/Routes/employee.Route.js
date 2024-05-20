const express =require('express')
const eroute=express.Router()
const employeeController=require('../Controller/employee.Controller.js')
const Auth =require("../Middleware/auth.Middleware.js")

// eroute.use(Auth.verification)



eroute.post('/',Auth.roleCheck(['admin']),employeeController.addEmployee)

eroute.get('/',Auth.roleCheck(['admin','user']),employeeController.showEmployee)

eroute.get('/:id/info',Auth.roleCheck(['admin']),employeeController.employeeInfo)

eroute.delete('/:id',Auth.roleCheck(['admin']),employeeController.delEmployee)

eroute.put('/:id',Auth.roleCheck(['admin']),employeeController.updateEmployee)




module.exports=eroute