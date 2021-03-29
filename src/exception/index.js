const errors=(code,type, message, result)=>{
return {"code": code, "type": type,"message":message,"result":result};
};
module.exports=errors;