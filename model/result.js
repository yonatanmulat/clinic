const { string } = require("joi");
const mongoose=require("mongoose");
const schema= mongoose.Schema;
const resultschema= new schema({
   test:[{
      type:String
   }],appearance:{
      type:String,
   },consistance:{
      type:String,
   },pus:{
      type:String,
   },RBCs:{
      type:String,
   },color:{
      type:String,
   },ph:{
      type:String,
   },glucose:{
      type:String, 
   },protien:{
      type:String,
   },blood:{
      type:String,
   },stoolage:{
      type:String
   },parasite:{
      type:String
   },appearanceu:{
      type:String
   },gravity:{
      type:String,
   }, bilirubin:{
      type:String
   },urobilinogen:{
      type:String,
   },ketone:{
      type:String
   },nitrite:{
      type:String
   },leukocycte:{
      type:String,
   },hugtest:{
      type:String
   },wbc:{
      type:String
   },epitherialcell:{
      type:String
   },bacteria:{
      type:String
   },crystal:{
      type:String
   },casts:{
      type:String
   },other:{
      type:String
   }
})

const Result= mongoose.model("Result",resultschema);

module.exports= Result;