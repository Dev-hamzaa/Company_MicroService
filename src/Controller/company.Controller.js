const companyModel = require("../Model/company.Model")
const constraints = require("../Constraints/Constraints")
const departmentModel = require("../Model/department.Model")
const EmployeeModel = require("../Model/employee.Model")
const express = require("express")
const { default: axios } = require("axios")

const addCompany = async (req, res) => {
  try {
    const companyName = req.body.companyName;
    const contact = req.body.contact;



    if (
      !constraints.namePattern.test(companyName)
      || !constraints.contact.test(contact)
    ) {



      return res.status(400).send("Credentials  should be valid");
    } else {

      const newCompany = new companyModel({
        companyName: companyName,
        contact: contact
      });
      try {
        const duplicateName = await companyModel.findOne({
          companyName: companyName,
        })
        const duplicateContact=await companyModel.findOne({
          contact:contact
        })
        if (duplicateName||duplicateContact) {

          return res.status(409).send("Can not add Duplicate value")
        } else {
          await newCompany.save();
          return res.status(201).send("Added");
        }
      } catch (error) {
        console.error('Error',error);
        return res.status(500).send("Something went wrong");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};

const showCompany = async (req, res) => {
  //  console.log('im showing company')
  try {
    const result = await companyModel.find({},{__v:0});
    if (result.length === 0) {
      return res.send("No Data Found");
    } else {
      res.send(result);
    }
  } catch (error) {
    console.log(error)
    res.status(500).send("Something Went Wrong");
  }
};

const showEmployee = async (req, res) => {
  try {
    const CompanyId = req.params.id;
    const result = []
    if (!constraints.expression.test(CompanyId)) {
      res.status(400).send("Please Enter correct Id");
    } else {
      let company = await companyModel.findById({ _id: CompanyId });
      if (!company) {
        return res.status(400).send("Company Not Found");
      } else {
        const employees = await EmployeeModel.find({ Company: CompanyId })
        for (let emp = 0; emp < employees.length; emp++) {
          const personId = employees[emp].Person
          const detail = await axios.get(process.env.url + `${personId}`).then(body => body.data)
          if (detail.Name != null) {
            let val = {
              CompanyId: req.params.id,
              id: employees[emp]._id,
              Name: detail.Name
            }
            result.push(val)
          } else {
            emp++
          }
        }
        return res.status(200).send(result)
      }
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send(error);
  }
};

const showCompanydepartment = async (req, res) => {
  try {
    console.log('SHOW DEPARTMENT');
    const id = req.params.id;
    if (!constraints.expression.test(id)) {
      res.status(400).send("please enter  Correct ID");
    } else {
      const result = await departmentModel.find({ Company: id },{__v:0});
      if (result.length === 0) {
        res.status(200).send("No Departement found");
      } else {
        res.status(200).send(result);
      }
    }
  } catch (error) {
    res.status(500).send("Something Went Wrong");
  }
};


const delCompany = async (req, res) => {
  try {
    const CompanyId = req.params.id;

    if (!constraints.expression.test(CompanyId)) {
      return res.status(400).send('ID is not Valid');
    }

    const deletedCompany = await companyModel.findOne({ _id: CompanyId });

    if (!deletedCompany) {
      return res.status(404).send('Company not found');
    }

    const companyId = deletedCompany._id;

    try {
      const listOfDepartments = await departmentModel.find({ Company: companyId });

      if (listOfDepartments.length === 0) {
        await companyModel.deleteOne({ _id: CompanyId });
        return res.status(200).send('Deleted');
      } else {
        for (const element of listOfDepartments) {
          const listOfEmployees = await EmployeeModel.find({ Company: companyId });

          if (listOfEmployees.length === 0) {
            await departmentModel.deleteOne({ Company: companyId });
            await companyModel.deleteOne({ _id: companyId });
            return res.status(200).send('Deleted');
          }

          for (const employee of listOfEmployees) {
            const url = `${process.env.url}${employee.Person}`;
            await axios.put(url, { EmployedStatus: false });
          }

          await EmployeeModel.deleteMany({ Company: companyId });
          await departmentModel.deleteMany({ Company: companyId });
          await companyModel.deleteOne({ _id: companyId });
        }

        // Send the response after all operations are completed
        return res.status(200).send('Deleted');
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send('Something went Wrong');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Something Went Wrong');
  }
};


const updateCompany = async (req, res) => {
  try {
    const _id = req.params.id;
    let message = '';

    if (!constraints.expression.test(_id)) {
      return res.status(400).send('ID is not valid');
    }

    const updateCompany = await companyModel.findById(_id);

    if (!updateCompany) {
      return res.status(400).send('Company not found.');
    }


    const update = { $set: {} };

    if (req.body.length == 0) {
      console.log(req.body.length==0);
      return res.status(400).send('Credentails not found');
    } else {

      if (req.body.companyName ) {
        if (constraints.namePattern.test(req.body.companyName)) {

          update.$set.companyName = req.body.companyName;
        } else {
          message = 'Please enter a valid Name';
        }
      }

      if (req.body.contact ) {
        if (constraints.contact.test(req.body.contact)) {
          update.$set.contact = req.body.contact;
        } else {
          message = 'Please enter a valid Number';
        }
      }
      console.log('MEassage', message);
      if (message) {
        return res.status(400).send('Invalid Credentials');
      } else {
        try {
          const result = await companyModel.updateOne({ _id }, update);

          if (result) {
            return res.status(200).send('Updated');
          } else {
            return res.status(500).send('Something went wrong');
          }
        } catch (error) {
          console.error(error);
          return res.send('Something went wrong');
        }
      }
    }

  } catch (error) {
    console.error(error);
    return res.status(500).send('Something went wrong');
  }
};

module.exports = {
  addCompany,
  showCompany,
  delCompany,
  updateCompany,
  showCompanydepartment,
  showEmployee,
};
