const express=require('express');
const router=express.Router();
const  {  accessToken } =require('../auth/authServer');
const { authenticateRol }=require('../users');

router.post('/login', async(req,res)=>{
try {
    const { username, password }=req.body; 
    
    const rol= await authenticateRol(username,password);
    if(rol.code===0){
        const authDR ={name: username, rol:rol.result};
        const token=accessToken(authDR);
        res.json({accessToken: token}); 
    }else{
        res.status(rol.code).json({error: rol.message});
    }       
} catch (error) {
    console.log(error);
    res.status(500).json({error: 'Error inesperado'}); 
}
});

module.exports=router;

