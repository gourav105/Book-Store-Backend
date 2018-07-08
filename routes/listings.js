const exp=require('express')
const listingroute=exp.Router();
const Seq=require('../db').Seq;
const Books=require('../db').Listings;

//request for all listings added by all users except logged in user
listingroute.get('/',(req,res)=>{
   Books.findAll({attributes: ['bookid', 'bookName','authorName','imageLink','price','condition','userEmail'],
       where:{
           'userEmail':{[Seq.Op.ne]:req.query.email}
       },
       order:[['bookid','DESC']],
       })
       .then((data)=>
       {
           res.send(data);
       })

})
//request for listings only added by logged in user
listingroute.get('/booksbyme',(req,res)=>{
    Books.findAll({attributes: ['bookid', 'bookName','authorName','imageLink','price','condition','userEmail','createdAt'],
        where:{
            'userEmail':req.query.email
        },
        order:[['bookid','DESC']],
    })
        .then((data)=>
        {
            console.log(data);
            res.send(data);
        })

})
//request for deleting the listing which is added by logged in user
listingroute.get('/removebookadd',(req,res)=>{
    Books.destroy({
        where:{
            'bookid':req.query.id
        }
    })
    res.send('{}');


})
//request when user clicks on particular listing
listingroute.get('/singlelisting',(req,res)=>{
    Books.find({
        where:{
            'bookid':req.query.id
        }
    })
    .then(data=>{res.send(data)})
})
//when new listing is added
listingroute.post('/',(req,res)=> {
    console.log("In Request",req.body.params);
    Books.create({
        'bookName':req.body.params.bookName,
        'authorName':req.body.params.authorName,
        'imageLink':req.body.params.imageLink,
        'price':req.body.params.price,
        'condition':req.body.params.condition,
        'userEmail':req.body.params.userEmail,

    })
        .then((createdbook)=>
        {
            res.send(createdbook);
        })


})

module.exports=listingroute
