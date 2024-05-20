const express  =require("express")
const uroute=express.Router()

const  userController  =require("../Controller/user.Controller")


uroute.post('/signup',userController.signUp)

uroute.post('/login',userController.logIn)

module.exports =uroute