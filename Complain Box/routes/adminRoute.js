const express = require("express");

const config = require("../config/config");
const adminRoute = express();
const session = require("express-session");
adminRoute.use(session({
    
    secret:config.sessionSecrete,
    saveUninitialized:false,
    resave:true
}));

const bodyParser = require("body-parser");
adminRoute.use(bodyParser.json());
adminRoute.use(bodyParser.urlencoded({extended:true}));

adminRoute.set('view engine','ejs');
adminRoute.set('views',"./views/admin");

const auth = require("../middleware/adminAuth");

const adminController = require("../controller/adminController");

adminRoute.get('/',adminController.loadLogin);

adminRoute.post('/',adminController.verifyLogin);
adminRoute.get('/home',adminController.loadDashboard);

adminRoute.get('/logout',adminController.logout);

adminRoute.get('*',(req,res)=>{
    res.redirect('/admin');
});

module.exports = adminRoute;