const express = require("express");
const router = express.Router();
const Request = require("../model/request")
const Patient = require("../model/patient")
const Clinic = require("../model/clinic")
const Check = require("../model/check")
const Errorhander = require("../errorhander")
const catchasync = require("../catchasync");
const { isloginstaff } = require("../middleware");
const bcrypt=require("bcryptjs")
const {valpatient,valid,changepassword}=require("../joi")

router.get("/register/staff", (req, res) => {
  res.render("staff/register")
})

router.post("/register/staff",valid, catchasync(async (req, res) => {
  const { username, password } = req.body;
  const staff = await Clinic.findOne({ username })
  const registered= await Check.findOne({username})
  if (staff && staff.role=="staff" && !registered) {
    const hash= await bcrypt.hash(password,12) 
     const validstaff = new Check({ username,...req.body,
      role:staff.role, password:hash})
     validstaff.save();
     req.flash("success","successfully registered")
     res.redirect("/login/staff")
  } else {
     req.flash("error", "unregisterd username or already register")
     res.redirect("/register/staff")
  }
}))

router.get("/login/staff", (req, res) => {
  res.render("staff/stafflogin")
})
router.post("/login/staff", catchasync(async (req, res) => {
  const { username, password } = req.body;
  const user= await Check.findOne({username})
  if (user && user.role == "staff") {
     const validstaff= await bcrypt.compare(password,user.password)
     if(validstaff){
      req.session.staff_id=[user._id,user.firstname,user.lastname];
      req.flash("success",`welcome dear ${user.firstname}`)
      res.redirect(`/request/${user._id}`)
     }else {
      req.flash("error", "incorrect username or password")
      res.redirect("/login/staff")
   }
     
  } else {
     req.flash("error", "incorrect username or password")
     res.redirect("/login/staff")
  } 
}))
router.get("/request/:id",isloginstaff,(req,res)=>{
  const {id}=req.params
  res.render("request/request",{id})
})

router.get("/changepassword/:id",isloginstaff,(req,res)=>{
  const{id}=req.params
  res.render("staff/pass",{id})
})
router.post("/changepassword/:id", changepassword, catchasync(async(req,res)=>{
   const{id}=req.params
   const{oldpassword,password1}=req.body
   const user= await Check.findById(id)
   console.log(user)
   const validpassword= await bcrypt.compare(oldpassword,user.password)
   if(validpassword){
    const hash= await bcrypt.hash(password1,12);
    const update= await Check.findByIdAndUpdate(id,{password:hash})
    req.flash("success","successfully updated");
    res.redirect(`/request/${id}`)
   } else{
    req.flash("error","incorrect password");
    res.redirect(`/request/${id}`)
   }
}))

router.get("/login/:id/doctor",isloginstaff, catchasync(async (req, res) => {
  const { id, reqid } = req.params;
  const patient = await Patient.findById(id)
  const doctors = await Check.find({ role: "doctor" })
  res.render("staff/index", { patient, doctors, reqid })
}))
router.post("/login/:id/doctor", catchasync(async (req, res, next) => {
  const{id}=req.params;
  const {username}=req.body;
  const patient= await Patient.findById(id);
  const doctor = await Check.findOne({username});
  if(doctor){
    const request = new Request({patientID:patient,doctorID:doctor})
    request.save();
    req.flash("success","successfully assign to doctor");
    res.redirect(`/request/${doctor._id}`)
  } else{
    req.flash("error","unregistered username");
    res.redirect(`/login/${id}/doctor`)
  }

}))
router.get("/login/:id/edit",isloginstaff, catchasync(async(req,res)=>{
  const{id}= req.params;
  const patient= await Patient.findById(id)
  res.render("staff/editpatient",{patient})
}))
router.patch("/login/:id",valpatient, catchasync( async(req,res)=>{
  const{id}=req.params;
  const edit= await Patient.findByIdAndUpdate(id,{...req.body})
  console.log(edit)
  res.redirect(`/login/${id}/doctor`)
}))

router.get("/staff/logout/:id",(req,res)=>{
  req.session.staff_id=null;
  res.redirect("/")
})



module.exports = router
