const mongoose=require("mongoose")
const schema=mongoose.Schema;
const Result= require("../model/result")
const data= new Date();
let day= data.getDate();
let month=data.getMonth()+1;
let year= data.getFullYear();
let currentdata=`${day}-${month}-${year}`

const requestschema= new schema({
   date:{
      type:String,
      default:currentdata
   }, patientID:{
      type:schema.Types.ObjectId,
      ref:"Patient"
   }, doctorID:{
      type:schema.Types.ObjectId,
      ref:"User"},
   result:[{
      type:schema.Types.ObjectId,
      ref:"Result"}]
})
 requestschema.post("findOneAndDelete",async function(doc){
 
     if(doc){
      await Result.deleteOne({
         _id:{
            $in:doc.result
         }
      })
   }
}) 

const Request=mongoose.model("Request",requestschema)

module.exports=Request;