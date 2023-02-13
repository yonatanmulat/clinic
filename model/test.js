const mongoose=require("mongoose")
const schema=mongoose.Schema;

const testschema=new schema({
   name:[{
      type:String,
   }],
   description:{
      type:String
   },
})


const Test=mongoose.model("Test",testschema)

module.exports=Test; 