const mongoose=require("mongoose")
const schema=mongoose.Schema;

const clinicshema= new schema({
   role:{
      type:String,
      lowercase:true,
      enum:["doctor","reception","laboratory"]
   },username:{
      type:String,
      unique:true,
      required:true
   }

})

const Clinic =mongoose.model("User",clinicshema) 

module.exports=Clinic;
