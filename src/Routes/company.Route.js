const express=require('express')
const croute=express.Router()
const companyController =require('../Controller/company.Controller')
const Auth =require("../Middleware/auth.Middleware")

// croute.use(Auth.verification)

croute.post('/',Auth.roleCheck(['admin']), companyController.addCompany);
// croute.post('/', companyController.addCompany);

croute.get('/',Auth.roleCheck(['admin','user']),companyController.showCompany);

croute.get('/:id/Employee',Auth.roleCheck(['admin','user']), companyController.showEmployee);


croute.get('/:id/department',Auth.roleCheck(['admin','user']), companyController.showCompanydepartment);

croute.delete('/:id',Auth.roleCheck(['admin']), companyController.delCompany);


croute.put('/:id',Auth.roleCheck(['admin']),companyController.updateCompany);


module.exports= croute
