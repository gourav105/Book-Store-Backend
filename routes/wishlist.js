const exp=require('express')
const wishlistroute=exp.Router();
const Wishlist=require('../db').Wishlist;
const Listing=require('../db').Listings;
//request for fetching wishlist of logged in user by joining wishlist and listing table
wishlistroute.get('/',(req,res)=>{
    let email=req.query.email;
    Wishlist.findAll({
      where:{
          'userEmail':email

      },
        include:[Listing]
    }).then(data=>{
       res.send(data);
    })

})
//request for adding new book in wishlist
wishlistroute.post('/',(req,res)=>{
    let email=req.body.params.email;
    let bid=req.body.params.bookid;
    Wishlist.find({
        where:{
            'userEmail':email,
            'listingBookid':bid
        }
    })
        .then(data=>{
            //if item is not already in your wishlist
            console.log("Wishlst "+data);
             if(data==null)
             {
                 Wishlist.create({
                     'userEmail':email,
                     'listingBookid':bid
                 })
                     .then((response)=>res.send(response))
             }
             //if it is already added
             else
             {
                 res.send('{}')
             }
        })
})
//request for removing item from wishlist
wishlistroute.get('/delete',(req,res)=>{
    let id=req.query.id;
    Wishlist.destroy({
        where:{
            'id':id
        }
    })
    res.send('{}');

})
module.exports=wishlistroute;
