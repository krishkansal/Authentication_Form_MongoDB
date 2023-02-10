const mongoose=require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema=new mongoose.Schema({
    name:mongoose.Schema.Types.String,
    phone:mongoose.Schema.Types.Number,
    email:mongoose.Schema.Types.String,
    password:mongoose.Schema.Types.String,
    cpassword:mongoose.Schema.Types.String,
    tokens:[{
      token:{
        type:String,
        required:true
      }
    }]
})

//generating tokens

userSchema.methods.generateAuthToken = async function(){
  try{
    const token = jwt.sign({_id:this._id.toString()},"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",{
              expiresIn:"2 seconds"});
    this.tokens=this.tokens.concat({token:token})
    await this.save();
    return token;
  }catch (error){
      res.send("the error part "+ error);
      console.log("the error part" + error);
  }
}

//converting password into hash

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
      //  console.log(`the current password is ${this.password}`);
        this.password=await bcrypt.hash(this.password,10);
        this.cpassword=await bcrypt.hash(this.password,10);
    }
    next();
})

const data=new mongoose.model('data',userSchema);
module.exports=data;
