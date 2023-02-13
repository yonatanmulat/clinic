const mongoose=require("mongoose");
const schema=mongoose.Schema;
const bcrypt=require("bcryptjs")

const adminschema=new schema({
   firstname:{
      type:String
   },
   lastname:{
      type:String
   },
   age:{
      type:Number
   },gender:{
      type:String
   },
   username:{
      type:String,
   },
   password:{
      type:String
   }
})

const Admin=mongoose.model("Admin",adminschema);

const addadmin= async()=>{
   const password ="1234"
   const hash= await bcrypt.hash(password,12);
   const admin = new Admin({
      username:"Admin",
      firstname:"yonatan",
      lastname:"mulatu",
      age:30,
      gender:"male",
      password:hash
   })
   admin.save();
}

module.exports=Admin;