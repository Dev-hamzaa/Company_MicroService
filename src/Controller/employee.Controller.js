const constraints =require('../Constraints/Constraints')
const employeeModel =require('../Model/employee.Model')
const CompanyModel =require('../Model/company.Model')
// const PersonModel =require('../Model/person.Model')
const departmentModel =require('../Model/department.Model')
const axios=require('axios') 

const addEmployee = async (req, res) => {
    const Company = req.body.Company;
    const Person = req.body.Person;
    const Department = req.body.Department;
    const Salary = req.body.Salary;
    console.log(req.body)
    if (!constraints.expression.test(Company) || !constraints.expression.test(Person) || !constraints.expression.test(Department) || !Salary) {
      return res.status(400).send('Please enter valid credentials');
    }
    if(Salary<0){
      console.log("Salary m rolaa h ");
      return res.status(400).send('Please Enter Valid Credentials')
    }
  
    try {
      const addCompany = await CompanyModel.findById(Company);
      const addDepartment = await departmentModel.findById(Department);
      const personResponce=await axios.get(process.env.url+`${Person}`)
      if (!personResponce || !addCompany || !addDepartment) {
        return res.status(400).send('Invalid credentials');
      }
      const duplicateEmployee=await employeeModel.find({Person:Person})
      console.log('Employee',duplicateEmployee.data);
      
      if(duplicateEmployee.data===undefined||duplicateEmployee.length===0){
        console.log("in here");
        const newEmployee = new employeeModel({
          Person: Person,
          Company: Company,
          Department: Department,
          Salary: Salary,
        });
        console.log("Dataa to be saved",newEmployee);
       const re= await axios.put(`${process.env.url}${Person}`,{EmployedStatus:true})
       console.log('Response',re.data)
        await newEmployee.save();   
        return res.status(201).send('Employee Added');
      }else{
        console.log(duplicateEmployee);
        return res.status(409).send("Employee Exsist")
      }
  
      
  
      
    } catch (error) {
      // console.error(error);
      return res.status(500).send('Something went wrong');
    }
  };

// const showEmployee=async(req,res)=>{
//      try{ 
      
//       const employees=await employeeModel.find() 
//       console.log('========================================================');
//       console.log(employees)
//       const result=[]
//       for(let emp=0;emp<employees.length;emp++){
//         if(employees[emp].Person!=null){
//        const  personId=employees[emp].Person
//        const detail=await axios.get(process.env.url+`${personId}`).then(result=>result.data)
//        if(detail===undefined){
//         emp++
//        }
//        if(detail.Name!=null){
//          let val={
//           PersonId:employees[emp].Person,
//           id:employees[emp]._id,
//           Name:detail.Name,
//           Salary:employees[emp].Salary
//         }
//         result.push(val)
//       } 
//       }else{

//         emp++
//       }  
//       }; 
     
//     if(result.length>0){
//         res.status(200).send(result)
//     } else{
//         res.status(200).send("no data found")
//     }
//      }
//     catch(err){
//       // console.log(err);
//       console.log("this is error");
//         res.status(500).send("Something Went Wrong")
//      }  
// }

const showEmployee = async (req, res) => {
  try {
    const employees = await employeeModel.find();
    console.log('========================================================');
    console.log(employees);

    const result = [];

    for (let emp = 0; emp < employees.length; emp++) {
      if (employees[emp].Person !== null) {
        const personId = employees[emp].Person;
        try {
          const detail = await axios.get(process.env.url+`${personId}`).then((result) => result.data);
          console.log(detail.data)
          if (detail && detail.Name !== null) {
            const val = {
              PersonId: employees[emp].Person,
              id: employees[emp]._id,
              Name: detail.Name,
              Salary: employees[emp].Salary,
            };
            result.push(val);
          } else {
            await employeeModel.deleteOne({ _id: employees[emp]._id });
            console.log(`Employee with id ${employees[emp]._id} deleted due to missing person details.`);
          }
        } catch (error) {
          console.error('Error fetching person details:', error);
        }
      } else {
        // Delete the employee without a PersonId
        await employeeModel.deleteOne({ _id: employees[emp]._id });
        console.log(`Employee with id ${employees[emp]._id} deleted due to missing PersonId.`);
      }
    }

    if (result.length > 0) {
      res.status(200).send(result);
    } else {
      res.status(200).send("No data found");
    }
  } catch (err) {
    console.error('Error in showEmployee function:', err);
    res.status(500).send("Something Went Wrong");
  }
};


const employeeInfo =async(req,res)=>{
try {
  console.log('in info');
  const id=req.params.id
  // console.log(process.env.Url+`${id}`)
  const detail=await employeeModel.findOne({ _id:id })
  console.log(detail.body);
  if(detail){
    res.status(200).send(detail)

  }else{
    res.status(200).send('Employee not Found')
  }
} catch (error) {
  console.log(error);
  res.status(500).send('something Went Wrong')
}
}


const delEmployee=async (req,res)=>{
try {

    const EmployeeId=req.params.id
     let DelEmployee
     if(!constraints.expression.test(EmployeeId)){
      // console.log('in if');
      return res.status(400).send("Invalid Credentials")
     }
     else{
       DelEmployee=await employeeModel.findById(EmployeeId)
       console.log("GOINg to be del",DelEmployee);
       if(!DelEmployee){
        return res.status(404).send("Employee not found ")
       }
       else
       {const url=`${process.env.url}${DelEmployee.Person}`
        console.log(url);
        const re= await axios.put(url,{EmployedStatus:false})
        // console.log('Result from the person=====>',re)
        const data=await axios.get(`${process.env.url}`)
        console.log(data);
        const result=await employeeModel.deleteOne({_id:EmployeeId })
        
         if(result){
          console.log(result)
         
        //  console.log("UPdated EMployed Status",result1.data);
            res.status(200).send("deleted")
         }else{
            res.status(500).send("Something went wrong")
         }
       }
    
    }
} catch (error) {
    res.status(500).send("something went wrong")
}
     

     
}



const updateEmployee = async (req, res) => {

  console.log('Updatinn Endpoint Body',req.body);
  const _id = req.params.id;
  

  if (!constraints.expression.test(_id)) {
    return res.status(401).send('ID is not valid');
  }

  try {
    const updateEmployee = await employeeModel.findById(_id);
       console.log('Employe to be Updated',updateEmployee);
    if (!updateEmployee) {
      return res.status(404).send('Employee not found.');
    }

    const update = { $set: {} };
    let message = '';

    if (req.body.Salary) {
      if (req.body.Salary > 0) {
        update.$set.Salary = req.body.Salary;
      } else {
        message = 'Please enter a valid Salary';
      }
    }

    if (req.body.Department) {
         console.log("DEpartmeny is heree");
      if (constraints.expression.test(req.body.Department)) {
        const updateDepartment = await departmentModel.findById(req.body.Department);
        if (!updateDepartment) {
          message = 'Value not present';
        } else {
          update.$set.Department = req.body.Department;
        }
      } else {
        message = 'Please enter a correct ID';
      }
    }
    if (message) {
      return res.status(401).send('Invalid Credentials');
    }
     try{
      console.log('UPDATED OBJECT::::',update);
    const result=await employeeModel.updateOne({ _id }, update);
    console.log('=========>>>>> Updating Result',result);
    return res.status(200).send('Updated');}
    catch(error){
      console.log(error);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Something went wrong');
  }
};

module.exports={addEmployee,showEmployee,delEmployee,updateEmployee,employeeInfo}