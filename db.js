const Seq=require('sequelize');
//Connection Made With Postgress DB hosted at Elephant SQL
const db=new Seq('postgres://jjijosok:QaQvZg5DiulUirZ184p-ty_y_VCZT9hW@elmer.db.elephantsql.com:5432/jjijosok');
//User table for storing users info
const User = db.define('users', {
     email: {
        type: Seq.STRING,
         primaryKey:true
    },
    firstName: {
        type: Seq.STRING
    },
    lastName: {
        type: Seq.STRING
    },
    college:{
        type: Seq.STRING
    },
    address:{
        type: Seq.STRING
    },
    city:{
      type:Seq.STRING
    },
    state:{
        type:Seq.STRING
    },
    phoneNumber:{
        type: Seq.STRING
    },
    password:{
        type: Seq.STRING
    }
});
//Listings Table
const Listings = db.define('listings', {
    bookid: {
        type: Seq.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },

    bookName: {
        type: Seq.STRING
    },
    authorName:{
        type: Seq.STRING
    },
    imageLink:{
        type: Seq.STRING
    },
    price:{
        type: Seq.STRING
    },
    condition:{
        type: Seq.STRING
    }
});
Listings.belongsTo(User,{onDelete:'CASCADE'});
//Wishlist table for storing which item is added by which user
const Wishlist=db.define('wishlists',{
    id:{
        type: Seq.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    userEmail:{
        type:Seq.STRING
    },

})
Wishlist.belongsTo(Listings,{onDelete:'CASCADE'});
//Chats table for storing chats info such as last messages
const Chats=db.define('chats',{
    id:{
        type: Seq.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    users:{
        type:Seq.STRING
    },
    lastMessage:{
        type: Seq.STRING
    },
    from:{
        type: Seq.STRING
    },
    sellername:{
        type:Seq.STRING
    }

})
Chats.belongsTo(Listings,{onDelete:'CASCADE'});
//for storing all messages
const Messages=db.define('messages',{
    id:{
        type: Seq.INTEGER,
            primaryKey:true,
            autoIncrement:true
    },
    from:{
        type:Seq.STRING
    },
    message:{
        type:Seq.STRING
    }
})
Messages.belongsTo(Chats,{onDelete:'CASCADE'});

db.sync().then(function () {
    console.log("CREATED...")
})
    .catch(function (err) {
        throw err;
    })
exports=module.exports={Seq,User,Listings,Wishlist,Chats,Messages};