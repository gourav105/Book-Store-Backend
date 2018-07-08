const  exp=require('express');
const path = require('path')
const userroute=require('./routes/users');
const listingroute=require('./routes/listings');
const wishlistroute=require('./routes/wishlist');
const messageroute=require('./routes/messages');

const app=exp();
app.use(exp.json())
app.use(exp.urlencoded({extended: true}))

app.use('/',exp.static(__dirname+'/public'));



app.use('/users',userroute);
app.use('/listings',listingroute);
app.use('/wishlist',wishlistroute);
app.use('/messages',messageroute)

app.listen(process.env.PORT||8080,function () {
    console.log("Server Starts");
})
