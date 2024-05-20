const express = require('express');
const sroute = express.Router();
const searchController = require('../Controller/search.Controller');
const Auth = require('../Middleware/auth.Middleware')


sroute.get('/:word',Auth.roleCheck(['admin','user']),searchController.globalSearch)




module.exports= sroute