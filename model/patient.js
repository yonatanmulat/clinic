const mongoose = require("mongoose")
const schema = mongoose.Schema;
const Patientschema = new schema({
   firstname: {
      type: String
   },lastname: {
      type: String
   }, age: {
      type: String
   },gender:{
      type:String
   },departement:{
      type:String
   },studentid: {
      type: String
   }, medicalhistory: [{
      type: schema.Types.ObjectId,
      ref: "PatientResult"
   }]
})
const Patient = mongoose.model("Patient", Patientschema)
module.exports = Patient;