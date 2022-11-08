const express = require("express");
const adminRoute = express();
const bodyParser = require('body-parser');
adminRoute.use(bodyParser.json());
adminRoute.use(bodyParser.urlencoded({extended:true}));

adminRoute.set('views',"./views/admin");
adminRoute.set('view engine','ejs');

//const adminController = require("../controller/adminController");

const adminLoginLoad = async(req,res)=>{
    try{
         res.render('adminlogin');
    }catch(error){
        console.log(error.message);
    }
}

adminRoute.get('/adminlogin',adminLoginLoad);

module.exports = adminRoute;