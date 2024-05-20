const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const app = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

const endpoint = '/api/company/';


describe('Company', () => {
  it('should create  new Company and return 201', async  function() {
    this.timeout(10000)
    const res =await  chai.request(app)
      .post(`${endpoint}`)
      .send({
        companyName:'starlite',
        contact:"0301-4932025"
      })
    expect(res.status).to.be.equal(201);   
  });
  it('should not create   new Company and return 409', async  function() {
    this.timeout(10000)
    const res =await  chai.request(app)
      .post(`${endpoint}`)
      .send({
        companyName:'starlite',
        contact:"0301-4932025"
      })
    expect(res.status).to.be.equal(409);   
  });
  it('should not create  new Company (missing Credentails) and return 400', async  function() {
    this.timeout(10000)
    const res =await  chai.request(app)
      .post(`${endpoint}`)
      .send({
        companyName:'',
        contact:"0301-4932025"
      })
    expect(res.status).to.be.equal(400);   
  });
 })
 it('should not create new Company due to invalid spaces and return 400', async  function() {
  this.timeout(10000)
  const res =await  chai.request(app)
    .post(`${endpoint}`)
    .send({
      companyName:'starlite',
      contact:"0301-   4932025"
    })
  expect(res.status).to.be.equal(400);   
});


/*******************************************/

describe('get all Companies',()=>{
  it('should get the  details of all the Companies and return 200',async function(){
    this.timeout(10000)
    const res=await chai.request(app).get(`${endpoint}`)
    expect(res.status).to.equal(200)
    expect(res.body).to.be.an('array')
    res.body.forEach(company => {
        expect(company).to.have.property('companyName');});
    })
  it('should not  get the  details of all the Companies and return 404',async function(){
    this.timeout(10000)
    const end='/api/Compmany/'
    const res=await chai.request(app).get(`${end}`)
    expect(res.status).to.equal(404)})
})

/********************************************************/

describe('get all Companies Employees',()=>{
    it('should get all  the Companies   employees and return 200',async function(){
      this.timeout(10000)
      const id='655f1d1090de8d8e91e399d4'
      const res=await chai.request(app).get(`${endpoint}${id}/Employee`)
      expect(res.status).to.equal(200) })
  it('should not get all  the Companies   employees and return 404',async function(){
    this.timeout(10000)
    const end='/api/Compmany/'
    const id='655f1d1090de8d8e91e399d4'
    const res=await chai.request(app).get(`${end}${id}/Employee`)
    expect(res.status).to.equal(404)})

    it('Invalid Credentials and return 400',async function(){
      this.timeout(10000)
      const end='/api/Company/'
      const id='655f1d1090de8d8e91e399d'
      const res=await chai.request(app).get(`${end}${id}/Employee`)
      expect(res.status).to.equal(400)})
      it('Company not found and return 400 ',async function(){
        this.timeout(10000)
        const end='/api/Company/'
        const id='655f1d8590de8d8e91e399dc'
        const res=await chai.request(app).get(`${end}${id}/Employee`)
        expect(res.status).to.equal(400)})
})


/*************************************/

  describe('get all Companies departments',()=>{
    it('should get all  the Companies  departments and return 200',async function(){
      this.timeout(10000)
      const id='655f1d1090de8d8e91e399d4'
      const res=await chai.request(app).get(`${endpoint}${id}/Department`)
      expect(res.status).to.equal(200)
    })
    it('Company not found  and return 400',async function(){
      this.timeout(10000)
      const id='655f1d8590de8d8e91e399dc'
      const res=await chai.request(app).get(`${endpoint}${id}/Department`)
      expect(res.status).to.equal(200)
    })
      it('Invalid Credentials and  return  400',async function(){
        this.timeout(10000)
        const end='/api/Company/'
        const id='655f1d1090de8d8e91e3994'
        const res=await chai.request(app).get(`${end}${id}/Department`)
        expect(res.status).to.equal(400)
  })
  it('URL not found and return 404',async function(){
    this.timeout(10000)
    const id='655f1d1090de8d8e91e399d4'
    const end='/api/Compmany/'
    const res=await chai.request(app).get(`${end}${id}/Department`)
    expect(res.status).to.equal(404)
  })
  })
    
/**********************************************************/
describe('Update the Company',()=>{
    it('should update the Company  and return 200',async function(){
        this.timeout(10000)
        const id='655f1f3990de8d8e91e399f2'
       
        const  res=await chai.request(app)
        .put(`${endpoint}${id}`)
        .send({
            companyName:"Tesla"
        })

        expect(res.status).to.equal(200);
        expect(res.text).to.equal('Updated')
        
      })

      it('Invalid Credentials  and return 400',async function(){
        this.timeout(10000)
        const id='655f1f3990de8d8e91e399'
       
        const  res=await chai.request(app)
        .put(`${endpoint}${id}`)
        .send({
            companyName:"Tesla"
        })

        expect(res.status).to.equal(400);
        expect(res.text).to.equal('ID is not valid')
        
      })
      it('Company not found  and return 400',async function(){
        this.timeout(10000)
        const id='6571ad1d05beffa42d0aa512'
       
        const  res=await chai.request(app)
        .put(`${endpoint}${id}`)
        .send({
            companyName:"Tesla"
        })

        expect(res.status).to.equal(400);
       
        
      })
    })

/********************************************************/

describe('Delete the Company',()=>{
    it('should delete the company and return 200',async function(){
        this.timeout(10000)
        const id='65784abb93df066458ee5e4e'
        const res=await chai.request(app).delete(`${endpoint}${id}`)
        expect(res.status).to.equal(200)
    })

    it('Invalid Credentials and return 400',async function(){
        this.timeout(10000)
        const id='6576ec22fdd03bc5df4f4fd'
        const res=await chai.request(app).delete(`${endpoint}${id}`)
        expect(res.status).to.equal(400)
    })
    it('Company not found and return 404',async function(){
      this.timeout(10000)
      const id='6571ad1d05beffa42d0aa512'
      const res=await chai.request(app).delete(`${endpoint}${id}`)
      expect(res.status).to.equal(404)
  })
})
