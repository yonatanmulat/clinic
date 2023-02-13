const mongoose= require("mongoose");
const schema= mongoose.Schema;

const data= new Date();
const year= data.getFullYear();
const month=data.getMonth()+1;
const day= data.getDate();
const currentdata= `${day}-${month}-${year}`

const resultschema= new schema({
   date:{
      type:String,
      default:currentdata
   },
   result:{
      type:String
   }
})

const PatientResult= mongoose.model("PatientResult",resultschema)

module.exports=PatientResult;


