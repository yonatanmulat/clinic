const mongoose=require("mongoose")
const schema= mongoose.Schema;
const Test = require("../model/test")
const data= new Date();
let day= data.getDate();
let month=data.getMonth()+1;
let year= data.getFullYear();
let currentdata=`${day}-${month}-${year}`

const labschema= new schema({
   date:{
      type:String,
      default:currentdata
   },
   patientID:{
      type:schema.Types.ObjectId,
      ref:"Patient"
   },
   test:{
      type:schema.Types.ObjectId,
      ref:"Test"
   },
   labratory:{
      type:schema.Types.ObjectId,
      ref:"Check"
   }

})
labschema.post("findOneAndDelete",async function(doc){
  if(doc){ await Test.deleteOne({
      _id:{
         $in:doc.test
      } }) } })

const Lab= mongoose.model("Lab",labschema);

module.exports=Lab;