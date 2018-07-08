const exp=require('express')
const userroute=exp.Router();
const User=require('../db').User;
//when request for login
userroute.get('/',(req,res)=>{
    let e=req.query.email;
    let p=req.query.password;
    User.find({where:
        {    'email': e,
             'password':p}
         })
        .then(response=>
            res.send(response))
        .catch(err=>{
          throw err;
        })
})
//when request for signup
userroute.post('/',(req,res)=>{
    User.findAll({
        where: {'email':req.body.params.email }
    })
        .then(datafromdb=>{
           //if email is not already registered
            if(JSON.stringify(datafromdb)==='[]')
            {
                User.create({
                    'email':req.body.params.email,
                    'firstName':req.body.params.firstname,
                    'lastName':req.body.params.lastname,
                    'college':req.body.params.college,
                    'address':req.body.params.address,
                    'city':req.body.params.city,
                    'state':req.body.params.state,
                    'phoneNumber':req.body.params.phno,
                    'password':req.body.params.password
                })
                    .then((createduser)=>
                    {
                       res.send(createduser);
                    })
            }
          //if email is already registered
            else
            {
                 res.send('{}');
            }
        })
})
//request for info of particular user
userroute.get('/info',(req,res)=>{
    let e=req.query.email;
    console.log("seller email",e);
    User.find({
        attributes: ['firstName', 'lastName','city','state','college'],
        where:
            {
                'email': e,
            }
    })
        .then(response=>{
            console.log("In Server DB LOGIN "+res);
            res.send(response);
        })
        .catch(err=>{
            throw err;
        })
})

module.exports=userroute
