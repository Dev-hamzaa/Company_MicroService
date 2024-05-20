  const  dotenv =require("dotenv")
  dotenv.config()
  const express=require('express')
  const indexRouter=require('./index')
  const app = express();
  const mongoose=require('mongoose')

  const cors=require('cors')



  mongoose.connect(process.env.DB) 

  app.use(cors())
  app.use(express.json())

  app.use('/api', indexRouter);

  

  app.use((req, res, next) => {
    res.status(404).send();
  });


  app.listen(process.env.port,()=>{
    console.log(`listenig to ${process.env.port}`);
  })
  module.exports=app

