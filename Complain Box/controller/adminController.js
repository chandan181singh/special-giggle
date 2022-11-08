
const adminLoginLoad = async(req,res)=>{
    try{
         res.render('adminlogin');
    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    adminLoginLoad
}