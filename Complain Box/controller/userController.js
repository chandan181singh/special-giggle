const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
//const { request } = require('../routes/userRoute');

const config = require("../config/config");

 const randomString = require("randomstring"); 

const securePassword = async(password)=>{
  try{
      const passwordHash = await bcrypt.hash(password,10);
      return passwordHash;
  }catch(error){
    console.log(error.message);
  }
}
//Verify mail
const sendVerifyMail = async(name,email,user_id)=>{
      try{
    const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        requireTLS:true,
        //service: 'gmail',
        auth:{
              user:config.emailUser,
              pass:config.emailUser
        }
    });
    const mailOptions = {
        from:'chandan181singh@gmail.com',
        to:email,
        subject:'For Verification at ComplainWebsite',
        html:'<p>Hii '+name+', Please Click here to <a href="http://localhost:3000/verify?id='+user_id+'">Verify</a> your mail</p>'
    }
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log("please god");
            console.log(error);
        }else{
            console.log("Email has been sent:- ",info.response);
        }
    })
      }catch(error){
        console.log(error.message);
      }
}
//registration
const loadRegister = async(req,res)=>{
    try{
          res.render('registration');
    }catch (error){
        console.log(error.message);
    }
}

//Forget password send email
const sendResetyMail = async(name,email,user_id)=>{
    try{
  const transporter = nodemailer.createTransport({
      host:'smtp.gmail.com',
      port:587,
      secure:false,
      requireTLS:true,
      //service: 'gmail',
      auth:{
            user:config.emailUser,
            pass:config.emailUser
      }
  });
  const mailOptions = {
      from:config.emailUser,
      to:email,
      subject:'For Verification at ComplainWebsite',
      html:'<p>Hii '+name+', Please Click here to <a href="http://localhost:3000/verify?id='+user_id+'">Verify</a> your mail</p>'
  }
  transporter.sendMail(mailOptions,function(error,info){
      if(error){
          console.log("please god");
          console.log(error);
      }else{
          console.log("Email has been sent:- ",info.response);
      }
  })
    }catch(error){
      console.log(error.message);
    }
}



const insertUser = async(req,res)=>{
   try{
    const spassword = await securePassword(req.body.password);
    const user = User({
        name:req.body.name,
        email:req.body.email,
        mbno:req.body.mbno,
        image:req.file.filename,
        password:spassword,
        is_admin:0
    });

    const userData = await user.save();

    if(userData){
        sendVerifyMail(req.body.name,req.body.email,userData._id);
        res.render('registration',{message:"Registered Successfully ,Please verify  your email"});
    }else{
        res.render('registration',{message:"Registered failed ,Please verify  your email"});
    }
   }catch(error){
    console.log(error.message);
   }
}

const verifyMail  = async(req,res)=>{
    try{
        const updateInfo = await User.updateOne({_id:req.query.id},{$set:{is_verified:1}});
        console.log(updateInfo);
        res.render("email-verified");
    }catch(error){
        console.log(error.message);
    }
}

//login method started

const loginLoad = async(req,res)=>{
    try{  
         res.render('login');
    }catch(error){
      console.log(eroor);
    }
}

const verifyLogin = async(req,res)=>{

    try{
       //const {email, password, is_verified} = req.body;
       const email = req.body.email;
       const password = req.body.password;
       const userData = await User.findOne({email:email});
       if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if(passwordMatch){
              if(userData.is_verified === 0){
                 res.render('login',{message:"Please verify your mail."});
              }else{
                   req.session.user_id = userData._id;
                   res.redirect('/home');
              }
            }else{
                res.render('login', {message:"Email or passworrd  is incorrect"});
            }
       }else{
        res.render('login', {message:"Email or passworrd  is incorrect"});
       }
    }catch(error){
        console.log(error.message);
    }
}

const loadHome = async(req,res)=>{
    try{
             res.render('home');
    }catch(error){
        console.log(error.messgae);
    }
}
//logout 
const userLogout = async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/');
    }catch(error){
      console.log(error.message);
    }
}

//forget password
const forgetLoad = async(req,res)=>{
    try{
       res.render('forget');
    }catch(error){
        console.log(error.message);
    }
}

const forgetVerify = async(req,res)=>{
    try{
       const email = req.body.email;
       const userData = await User.findOne({email:email});
       if(userData){
            if(userData.is_verified === 0){
                res.render('forget',{message:"Please Verify your mail"});
            }else{
                const randomString = randomString.generate();
                const updatedData = await User.updateOne({email:email},{$set:{ token:randomString}});

            }
       }else{
        res.render('forget',{message:"user email is incorrect."});
       }
    }catch(error){
        console.log(error.message);
    }
}



module.exports = {
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    forgetLoad,
    forgetVerify
}