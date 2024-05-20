const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const app = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

const endpoint = '/api/department/';


describe('Departmnent', () => {
  it('should  create new  department with return 201', async  function() {
    this.timeout(10000)
    const res =await  chai.request(app)
      .post(`${endpoint}`)
      .send({
        departmentName:'space',
        Company:"655f1d1090de8d8e91e399d4"
      })
    expect(res.status).to.be.equal(201);
  })
    it('should return error with the code 400',async function(){
        this.timeout(10000)
        const res =await  chai.request(app)
      .post(`${endpoint}`)
      .send({
        departmentName:'',
        Company:"655f1d1090de8d8e91e399d4"
      })
    expect(res.status).to.be.equal(400);
    })  
    it('Invlalid Credentials return error with the code 400',async function(){
      this.timeout(10000)
      const res =await  chai.request(app)
    .post(`${endpoint}`)
    .send({
      departmentName:'',
      Company:"6571ad1d05beffa42d0aa512"
    })
  expect(res.status).to.be.equal(400);
  })  
  it('Duplicate values return error with the code 409',async function(){
    this.timeout(10000)
    const res =await  chai.request(app)
  .post(`${endpoint}`)
  .send({
    departmentName:'space',
    Company:"655f1d1090de8d8e91e399d4"
  })
expect(res.status).to.be.equal(409);
})      
  });

/**********************************************/


describe('get all departments',()=>{
  it('should get the  details of all the departments and return 200',async function(){
    this.timeout(10000)
    const res=await chai.request(app).get(`${endpoint}`)
    expect(res.status).to.equal(200)   
})

it('should not get the  details of all the departments and return 404',async function(){
    this.timeout(10000)
    const end='/api/Departrment/'
    const res=await chai.request(app).get(`${end}`)
    expect(res.status).to.equal(404)   
})
})
/**********************************************/


describe('get  department Employees',()=>{
    it('should get all  the departent   employees and return 200',async function(){
      this.timeout(10000)
      const id='655f1d8590de8d8e91e399dc'
      const res=await chai.request(app).get(`${endpoint}${id}/employee`)
      expect(res.status).to.equal(200)
      
  })

  it('Invalid Credentials and return 400',async function(){
    this.timeout(10000)
    const id='655f1d8590de8d8e91e399d'
    const res=await chai.request(app).get(`${endpoint}${id}/employee`)
    expect(res.status).to.equal(400)})


    it('Department not found and return 404',async function(){
      this.timeout(10000)
      const id='655f1d1090de8d8e91e399d4'
      const res=await chai.request(app).get(`${endpoint}${id}/employee`)
      expect(res.status).to.equal(404)})
})

    
  /*******************************/

  describe('Update the  department',()=>{
    it('should update the department  and return 200',async function(){
        this.timeout(10000)
        const id='6571ad1d05beffa42d0aa512'
       
        const  res=await chai.request(app)
        .put(`${endpoint}${id}`)
        .send({
            departmentName:"Coding"})
        expect(res.status).to.equal(200);
      })   

      it('Invalid Credentaials  and return 400',async function(){
        this.timeout(10000)
        const id='6571ad1d05beffa42d0aa51'
       
        const  res=await chai.request(app)
        .put(`${endpoint}${id}`)
        .send({
            departmentName:"Gamer"})
        expect(res.status).to.equal(400);
      })

      it('Department not found  and return 404',async function(){
        this.timeout(10000)
        const id='655f1d1090de8d8e91e399d4'
       
        const  res=await chai.request(app)
        .put(`${endpoint}${id}`)
        .send({
            departmentName:"Gamer"})
        expect(res.status).to.equal(404);
      })
    })
    /*********************************************/

    describe('Delete the Department',()=>{
    it('should delete the deparment  and return 200',async function(){
        this.timeout(10000)
        const id='65784451495738e214cbdf5a'
        const res=await chai.request(app).delete(`${endpoint}${id}`)
        expect(res.status).to.equal(200)
    })


    it('Invalid Credentials and return 401',async function(){
        this.timeout(10000)
        const id='65784451495738e214cbdf5'
        const res=await chai.request(app).delete(`${endpoint}${id}`)
        expect(res.status).to.equal(401)
    })

    it('Department not found and return 404',async function(){
      this.timeout(10000)
      const id='657847fa5b144367e8f62bdc'
      const res=await chai.request(app).delete(`${endpoint}${id}`)
      expect(res.status).to.equal(404)
  })


})