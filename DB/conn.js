const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/signup-data")
.then( () => console.log("connection seccessfull..."))
.catch(err=>console.log(err));