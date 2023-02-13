const mongoose=require("mongoose")
const schema=mongoose.Schema;

const checkschema= new schema({
   firstname:{
      type:String,
   },
   lastname:{ 
      type:String,
   },
   age:{
      type:Number,
   },gender:{
      type:String,
      
   }, role:{
      type:String,
      
   },username:{
      type:String,
      
   },password:{
      type:String,
      
   }
})
const Check= mongoose.model("Check",checkschema)

module.exports=Check;

