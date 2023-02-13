const joi=require("joi")
const Errorhander=require("./errorhander")

module.exports.valid=(req,res,next)=>{
  const checkschema=joi.object({
    firstname:joi.string().required(),
    lastname:joi.string().required(),
    age:joi.number().min(0).required(),
    gender:joi.string().required(),
    username:joi.string().required(),
    password:joi.string().min(4).required()
  })
  const {error}= checkschema.validate(req.body)
  if(error){
    const msg= error.details.map(el=>el.message).join(",")
    throw new Errorhander(400,msg)
  } else{
    next();
  }
}
module.exports.valpatient=(req,res,next)=>{
  const patientschema=joi.object({
    firstname:joi.string().required(),
    lastname:joi.string().required(),
    age:joi.number().min(0).required(),
    gender:joi.string().required(),
    departement:joi.string().required(),
    studentid:joi.string().required(),
  })
  const {error}=patientschema.validate(req.body)
  if(error){
    const msg= error.details.map(e=>e.message).join(',')
    throw new Errorhander(400,msg)
  } else{
    next();
  }
}
module.exports.valadmin=(req,res,next)=>{
  const adminschema= joi.object({
    firstname:joi.string().required(),
    lastname:joi.string().required(),
    age:joi.number().min(0).required(),
    gender:joi.string().required(),
    username:joi.string().required(),
    password:joi.string().min(4).required()
  })
  const {error}=adminschema.validate(req.body);
  if(error){
    const msg= error.details.map(R=>R.message).join(",")
    throw new Errorhander(400,msg)
  } else{
    next();
  }
}
module.exports.changepassword=(req,res,next)=>{
  const passschema=joi.object({
    oldpassword:joi.string().min(3).required(),
    password:joi.string().min(3).required(),
    password1:joi.ref('password'),
  })
  const {error}=passschema.validate(req.body);
  if(error){
    const msg= error.details.map(R=>R.message).join(",")
    throw new Errorhander(400,msg)
  } else{
    next();
  }
}
module.exports.editpatient= (req,res,next)=>{
  const editschema=joi.object({
    
  })
}
