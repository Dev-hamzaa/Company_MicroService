const express = require('express')
const userModel = require("../Model/user.Model");
const Constraints = require("../Constraints/Constraints");
const jwt = require("jsonwebtoken");
const { default: axios } = require('axios');


const signUp = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const allPerson = await axios.get(process.env.url)
        let personExist
        if (
            !Constraints.namePattern.test(name) ||
            !Constraints.emailPattern.test(email) ||
            !Constraints.passwordPattern.test(password) ||
            !Constraints.roles.includes(role.toLowerCase())
        ) {
            return res.status(400).send("Please Enter Valid Credentials");
        } else {

            const data=allPerson.data
            console.log(data)
           data.forEach(element => {
            console.log(element.email);
            if(element.email===email){
                personExist=true
                console.log(personExist)
            }
           });

            console.log('USer Exist',personExist)
            if (personExist) {
                const duplicate = await userModel.findOne({ email: email });
                console.log('====>', duplicate);
                if (duplicate != null) {
                    return res.send("User Already exist");
                } else {
                    const newUser = new userModel({
                        name: name,
                        email: email,
                        password: password,
                        role: role,
                    });
                   const person = allPerson.data.find((record) => record.email === req.body.email)

                    
                 
                   
                    console.log("person",person);
                   
                    if (req.body.role === 'Admin' && person.EmployedStatus===false) {
                        
                        const result = await newUser.save();
                        await axios.put(`${process.env.url}${person._id}`, { AdminRole: true })
                        return res.status(200).send("Signup Succefully");
                    }else if(person.EmployedStatus===true&&req.body.role==='user'){
                        console.log("else if m")
                         const result = await newUser.save();
                         return res.status(200).send("Signup Succefully");
                    } 
                    else{
                        console.log(req.body.role);
                        return res.status(200).send("Not Authorized")
                    }
                   
                }
            }else{
                return res.status(200).send("Not found")
            }




        }
    } catch (error) {
        console.log(error);
        return res.send("Something went Wrong");
    }
};


const logIn = async (req, res) => {
    try {
        console.log("request body====>");
        console.log(req.body);
        const { email, password } = req.body;

        // const personData=await axios.get(process.env.url)
        // const filterperson=personData.data.find((record)=>record.email===email)
        // if(filterperson===undefined){
        //     const 
        //     return res.status(404).send('Invalid credentials')
        // }    

        const user = await userModel.findOne({ email });
        console.log("USer", user)

        if (user) {
            const personData = await axios.get(process.env.url)
            const filterperson = personData.data.find((record) => record.email === email)
            if (filterperson === undefined) {
                await userModel.deleteOne({ email: email })
                return res.status(404).send('User Not found')
            }

            const role = user.role.toLowerCase();

            if (user.password == password) {
                const payload = {
                    role: role,
                };

                const token = jwt.sign(payload, process.env.SECRET, {
                    expiresIn: "1h",
                });
                return res.status(200).send({
                    message: "Login Successfully",
                    token: token,
                });
            } else {
                console.log("password Incorrect")
                return res.send("Incorrect password");
            }
        } else {
            res.send("User not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};


module.exports = { signUp, logIn };
