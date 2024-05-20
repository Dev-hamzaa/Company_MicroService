const departmentModel = require('../Model/department.Model')
const constraints = require('../Constraints/Constraints')
// const employee=require('../Model/Employee.model')
const companyModel = require('../Model/company.Model')
const EmployeeModel = require('../Model/employee.Model')
const axios=require('axios')



const addDepartment = async (req, res) => {
  try {
    const departmentName = req.body.departmentName;
    const Company = req.body.Company;
    if (!constraints.namePattern.test(departmentName) || !constraints.expression.test(Company)) {
      return res.status(400).send("Credentials are not valid");
    }
    else {
      let addingCompany = await companyModel.findById(Company)
      let name = await departmentModel.findOne({ departmentName: departmentName,Company:Company })
      //console.log("name===>",name);
      //console.log(name[departmentName]);
      if (!addingCompany) {
        return res.status(400).send("No Company Found")
      }
      if(name!=null){
        // console.log('null ni h ');
      if (name.departmentName == departmentName) {

        return res.status(409).send('Deprtment Already Exsist')
      }
    }
      else {
        console.log('here');
        const newDepartment = new departmentModel({
          departmentName: departmentName,
          Company: Company
        })
        await newDepartment.save()
        res.status(201).send("Department Saved")
      }
    }
  } catch (err) {
    console.log(err)
    res.status(500).send("Something went Wrong")
  }

}


const showDepartment = async (req, res) => {
  try {
    const result = await departmentModel.find()
      .select('departmentName Company').populate('Company', 'companyName')
    if (result) {
      res.send(result)
    }
  } catch (err) {
    res.status(500).send("Something Went Wrong")
  }
}

const showDepartmentEmployees = async (req, res) => {
  console.log('im here');
  const DepartmentId = req.params.id;
  const result=[]
  if (!constraints.expression.test(DepartmentId)) {
    return res.status(400).send('Please enter a correct ID');
  }

  try {
    const checkDepartment = await departmentModel.findById(DepartmentId);

    if (!checkDepartment) {
      return res.status(404).send('Department not found');
    }

    const employees = await EmployeeModel.find({ Department: DepartmentId })
    for(let emp=0;emp<employees.length;emp++){
      const personId=employees[emp].Person
      const detail=await axios.get(process.env.url+`${personId}`).then(body=>body.data)
      if(detail.Name!=null){
        let val={
          DepartmentId:req.params.id,
          Employee_id:employees[emp]._id,
          Salary:employees[emp].Salary,
          Person_id:personId,
          Name:detail.Name
        }
        result.push(val)
      }
      else{
        emp++
      }
      
    }
     

    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Something Went Wrong');
  }
};




const delDepartment = async (req, res) => {
  const DepartmentId = req.params.id;

  if (!constraints.expression.test(DepartmentId)) {
    return res.status(400).send('ID is not Valid');
  }

  try {
    const Department = await departmentModel.findById(DepartmentId);

    if (!Department) {
      return res.status(404).send('Department not found');
    }
    const listOfEmployees=await EmployeeModel.find({Department:DepartmentId})
   
    if(listOfEmployees.length===0){
      console.log(" no data ");
       await departmentModel.deleteOne({_id:DepartmentId})
       return res.status(200).send('Deleted');
    }else{

        const result=listOfEmployees.map(
          async (element)=>{
            const url=`${process.env.url}${element.Person}`
            console.log(url);
            await axios.put(url,{EmployedStatus:false})
          }
        )
        console.log("ended of List")
        await EmployeeModel.deleteMany({Department:DepartmentId})
        await departmentModel.deleteOne({_id:DepartmentId})
        return res.status(200).send('Deleted')
        
      };
    }
  
   
   catch (error) {
    console.error(error);
    return res.status(500).send('Something went Wrong');
  }
};


const updateDepartment = async (req, res) => {
  try {
    const id = req.params.id;
    let message = '';

    if (!constraints.expression.test(id)) {
      return res.status(400).send('ID is not valid');
    }

    const updateDepartment = await departmentModel.findById(id);

    if (!updateDepartment) {
      return res.status(404).send('Department not found.');
    }

    const update = { $set: {} };

    if (req.body.departmentName) {
      if (constraints.namePattern.test(req.body.departmentName)) {
        update.$set.departmentName = req.body.departmentName;
      } else {
        message = 'Please enter a valid Name';
      }
    }

    if (req.body.Company) {
      if (constraints.expression.test(req.body.Company)) {
        const Companyname = await companyModel.findById(req.body.Company);

        if (!Companyname) {
          message = 'Invalid Company';
        } else {
          update.$set.Company = Companyname;
        }
      } else {
        message = 'Please enter a valid Name';
      }
    }

    if (message) {
      return res.status(400).send('Invalid Credentials');
    }

    departmentModel.updateOne({ _id: id }, update)
      .then(() => {
        return res.status(200).send('Updated');
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).send('Something went wrong');
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Something went wrong');
  }
};


module.exports = { addDepartment, showDepartment, delDepartment, updateDepartment, showDepartmentEmployees }