
const express = require("express");
const userRoute = express();
const session = require("express-session");

const config = require("../config/config");

userRoute.use(session({secret:config.sessionSecrete}));

const auth = require("../middleware/auth");

userRoute.set('view engine','ejs');
userRoute.set('views',"./views/users");

const bodyParser = require('body-parser');
userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({extended:true}));

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname, '../public/userImages'));
    },
    filename:function(req,file,cb){
     const name = Date.now()+'-'+file.originalname;
     cb(null,name);
    }
});

const upload = multer({storage:storage});

const userController = require("../controller/userController");
userRoute.get('/register',auth.isLogout, userController.loadRegister);

userRoute.post('/register',upload.single('image'),userController.insertUser);

userRoute.get('/verify',userController.verifyMail);

userRoute.get('/',auth.isLogout,userController.loginLoad);
userRoute.get('/login',auth.isLogout,userController.loginLoad);
userRoute.post('/login', userController.verifyLogin);

userRoute.get('/home',auth.isLogin, userController.loadHome);

userRoute.get('/logout',auth.isLogin,userController.userLogout);

userRoute.get('/forget',auth.isLogout,userController.forgetLoad);

userRoute.post('/forget',userController.forgetVerify);

userRoute.get('/forget-password',auth.isLogout,userController.forgetPasswordLoad);

userRoute.post('/forget-password',userController.resetPassword);

//userRoute.post('/complain-submit',userController.insertComplain);

module.exports = userRoute;
