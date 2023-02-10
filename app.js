const express=require("express")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
require("./DB/conn");
const data=require("./model/signup")
const app=express()
const port=3000 || process.env.PORT


app.use(express.json());
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

app.get('/',(req,res)=>{
    
    res.send("Home page")

})


app.get('/login',(req,res)=>{
    
    return res.redirect("login.html");

})


app.post('/login',async (req,res)=>{
    try{

        const Email=req.body.email;
        const Password=req.body.password;

       // console.log(`${Email} and password is ${Password}`);

       const useremail = await data.findOne({email:Email});

        const matchpassword = await bcrypt.compare(Password,useremail.password);

        if(matchpassword){
            res.status(201).send("Home page");
        }else{
            res.send("Invalid Login Details");
        }
       
    }catch(error){
        res.status(400).send("Record not found")
    }
    
})





app.get('/signup',(req,res)=>{
    
    return res.redirect("signup.html");

})


app.post('/signup',async (req,res)=>{
    try{
        const password=req.body.password;
        const cpassword=req.body.cpassword;

        if(password===cpassword){

            const signupdata=new data({
                name:req.body.name,
                phone:req.body.phone,
                email:req.body.email,
                password:req.body.password,
                cpassword:req.body.cpassword

            })
            console.log("the success part" + signupdata);

            const token=await signupdata.generateAuthToken(); 
            console.log("the token part" + token);

            const registered =await signupdata.save();
            console.log("the page part" + registered);
            res.status(201).send("home page")

        }else{
            res.send("password are not matching")
        }

    }catch(error){
        res.status(400).send(error);
    }
})



// app.post("/signup",(req,res)=>{
//     console.log(req.body.name);
//     console.log(req.body.phone);
//     console.log(req.body.email);
//     console.log(req.body.password);
//     console.log(req.body.cpassword);

//     const password=req.body.password;
//     const cpassword=req.body.cpassword;


//     data.find({email:req.body.email})
//     .then(result=>{
//         if(result.length!==0){
//               // Email already exist
//               res.send({message:'Email already exist,try again with different email'})
//         }else if(password===cpassword){
//             const users=new data({
//                 name: req.body.name,
//                 phone: req.body.phone,
//                 email: req.body.email,
//                 password: req.body.password,
//                 cpassword: req.body.cpassword
//             })
            
//              //Password Hashing

//             users.save()
//             .then(()=>{ res.status(201).send("home page");})
//             .catch((e) => {res.status(400).json(e);})

//         }else{
//             res.send("password are not matching")
//         }
//     })
//      .catch(err => res.status(500).json( {message: 'Server Encountered an Error', error: err} ))  

//     })


                                      
                //Password Hashing

// const bcrypt=require('bcrypt');

// const securePassword=async(password)=>{
//     const passwordHash=await bcrypt.hash(password,10);
//     console.log(passwordHash);

//     const passwordmatch=await bcrypt.compare(password,passwordHash);
//     console.log(passwordmatch);
// }

// securePassword("12345");


                //Generating Token

// const createToken = async()=>{
//     const token = await jwt.sign({_id:"63e678b3ed6430331c8b1098"},"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",{
//         expiresIn:"2 seconds"
//     });
//     console.log(token);

//     const userVer=await jwt.verify(token,"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
//     console.log(userVer);
// }

// createToken();

app.listen(port,()=>{
    console.log("connection setup");
})