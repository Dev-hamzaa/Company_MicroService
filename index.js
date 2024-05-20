
const express=require('express')
const router= express.Router();

const croute=require('./src/Routes/company.Route')
const droute=require('./src/Routes/department.Route ')
const eroute=require('./src/Routes/employee.Route')
const sroute=require('./src/Routes/search.Route')
const uroute=require('./src/Routes/user.Route')




const Auth =require("./src/Middleware/auth.Middleware")

router.use(express.json());

router.use("/user", uroute);
 router.use(Auth.verification)
router.use("/company", croute);
router.use("/department", droute);
router.use("/employee", eroute);

router.use("/search", sroute);




module.exports=router;
