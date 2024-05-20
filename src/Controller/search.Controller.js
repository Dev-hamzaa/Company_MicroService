const express= require("express")

const employeeModel =require("../Model/employee.Model")

const constraint =require("../Constraints/Constraints");

const globalSearch = async (req, res) => {
  try {
    const word = req.params.word;

    if (constraint.specialChars.test(word)) {
      return res.send("Please Enter Correct word");
    } else {
      
      const result = await employeeModel.aggregate([
        {
          $lookup: {
            from: "people",
            localField: "Person",
            foreignField: "_id",
            as: "Person",
          },
        },
        {
          $unwind: "$Person",
        },
        {
          $match: {
            "Person.Name": { $regex: word, $options: "i" },
          },
        },
        {
          $group: {
            _id: null,
            Employee: {
              $push: {
                id: "$_id",
                Name: "$Person.Name",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            Employee: 1,
          },

        },
        {
          $unionWith: {
            coll: "companies",
            pipeline: [
              {
                $match: {
                  companyName: { $regex: word, $options: "i" },
                },
              
              },
              {
                $group: {
                  _id: null,
                  Company: {
                    $push: { id: "$_id", companyName: "$companyName" },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  Company: 1,
                },
              },
            ],
          },
        },
        {
          $unionWith: {
            coll: "departments",
            pipeline: [
              { $match: { departmentName: { $regex: word, $options: "i" } } },
              {
                $group: {
                  _id: null,
                  Department: {
                    $push: {
                      id: "$_id",
                      departmentName: "$departmentName",
                    },
                  },
                },
              },
              { $project: { _id: 0, Department: 1 } },
            ],
          },
        },
      ]);
      console.log(result)
      if (result.length < 0) {
        res.status(200).send("Not Found");
      } else {
        res.status(200).send(result);
      }
    }
  } catch (err) {
    res.send("Invlaid");
  }
};


module.exports={globalSearch} 
