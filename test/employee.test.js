const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const app = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

const endpoint = '/api/employee/';


describe('Employee', () => {
  it('should return 201 and create employee with return 201', async  function() {
    this.timeout(10000)
    const res =await  chai.request(app)
      .post(`${endpoint}`)
      .send(
        {
            Person:"6576e316da679945d4d81f42",
            Company:"655f1d1090de8d8e91e399d4",
            Department:"655f1d8590de8d8e91e399dc",
            Salary:25000
        }
      )
    expect(res.status).to.be.equal(201);   
    // console.log(res.body);
  });

  it('should not  create employee and  return 401', async  function() {
    this.timeout(10000)
    const res =await  chai.request(app)
      .post(`${endpoint}`)
      .send(
        {
            Person:"6576e316da679945d4d81f42",
            Company:"655f1d1090de8d8e91e399d4",
            Department:"655f1d8590de8d8e91e399dc",
            
        }
      )
    expect(res.status).to.be.equal(401);   
  
  });

  it('duplicate Value  and  return 409', async  function() {
    this.timeout(10000)
    const res =await  chai.request(app)
      .post(`${endpoint}`)
      .send(
        {
            Person:"6576e316da679945d4d81f42",
            Company:"655f1d1090de8d8e91e399d4",
            Department:"655f1d8590de8d8e91e399dc",
            Salary:25000
            
        }
      )
    expect(res.status).to.be.equal(409);   
  
  });
}),
/*******************************************/
describe('get all Employees',()=>{
  it('should get  all the  Employees and return 200',async function(){
    this.timeout(10000)
    const res=await chai.request(app).get(`${endpoint}`)
    expect(res.status).to.equal(200)
    
})
it('should not get the  Employees Details and return 404',async function(){
    this.timeout(10000)
    const end='/api/employees/'
    const res=await chai.request(app).get(`${end}`)
    expect(res.status).to.equal(404)
    
})
})
/******************************************************/

describe('Update the  Employee',()=>{
    it('should update the Employee  and return 200',async function(){
        this.timeout(10000)
        const id='655f1ded90de8d8e91e399e4'
        const  res=await chai.request(app)
        .put(`${endpoint}${id}`)
        .send({
            Salary:5500})
        expect(res.status).to.equal(200);
       
      })

      it('Invalid Credentials  and return 401',async function(){
        this.timeout(10000)
        const id='655f1ded90de8d8e91e3994'
        const  res=await chai.request(app)
        .put(`${endpoint}${id}`)
        .send({
            Salary:5500})
        expect(res.status).to.equal(401);
       
      })
      it('Employee not found and return 404',async function(){
        this.timeout(10000)
        const id='65784451495738e214cbdf5a'
        const  res=await chai.request(app)
        .put(`${endpoint}${id}`)
        .send({
            Salary:5500})
        expect(res.status).to.equal(404);
       
      })
    })

/******************************************************/

describe('Delete the Employee',()=>{
    it('should delete the Employee and return 200',async function(){
        this.timeout(10000)
        const id='65784934430b1f21a3d22428'
        const res=await chai.request(app).delete(`${endpoint}${id}`)
        expect(res.status).to.equal(200)
    })

    it('Invalid Credentials and return 401',async function(){
        this.timeout(15000)
        const id='657847fa5b144367e8f62bd'
        
        const res=await chai.request(app).delete(`${endpoint}${id}`)
        expect(res.status).to.equal(401)
    })

    it('Employee not found and return 404',async function(){
      this.timeout(15000)
      const id='657847fa5b144367e8f62bdc'
      const end='/api/Employees/'
      const res=await chai.request(app).delete(`${end}${id}`)
      expect(res.status).to.equal(404)
  })

})