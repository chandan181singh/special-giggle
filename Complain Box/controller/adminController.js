const {User, Complain} = require("../models/userModel");
const bcrypt = require('bcrypt');
const loadLogin = async(req,res)=>{
    try{
         res.render('login');
    }catch(error){
        console.log(error.message);
    }
}

const verifyLogin = async(req,res)=>{
    try{

        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({email:email});
       // console.log(userData.name);
        if(userData){
            console.log("hello");
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if(passwordMatch){
                console.log("hello1");
                if(userData.is_admin === 0){
                    res.render('login',{message:"Email or password is incorrect 1"});
                }else{
                    console.log("hello2");
                    req.session.user_id = userData.id;
                    res.redirect("/admin/home");
                }
            }else{
                res.render('login',{message:"Email or password is incorrect 2"});``
            }
        }else{
            res.render('login',{message:"Email or password is incorrect 3"});``
        }
    }catch(error){
        console.log(error.message);
    }
}

const loadDashboard = async(req,res)=>{
    try{
       res.render('home');
    }catch(error){
        console.log(error.message);
    }
}

const logout = async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/admin');
    }catch(error){
        console.log(error.message);
    }
}
module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout
}