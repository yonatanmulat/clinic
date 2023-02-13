const jwt= require("jsonwebtoken")
const express = require("express");
const router = express.Router();
const Admin = require("../model/admin");
const Clinic = require("../model/clinic")
const Errorhander = require("../errorhander")
const catchasync = require("../catchasync");
const bcrypt = require("bcryptjs")
const Patient = require("../model/patient")
const Request= require("../model/request");
const Lab= require("../model/labratory");
const Check = require("../model/check");
const {isloginadmin}=require("../middleware");
const {valadmin,changepassword}=require("../joi")


router.get("/admin/login", (req, res) => {
   res.render("admin/adminlogin")
})
router.post("/admin/login", catchasync(async (req, res) => {
   const { username, password } = req.body;
   const admin = await Admin.findOne({ username })
   if(admin){
      const validpassword = await bcrypt.compare(password, admin.password)
      if (validpassword) {
         req.session.admin_id =[admin._id,admin.firstname,admin.lastname]
         req.flash("success", `welcome dear ${admin.firstname}`)
         res.redirect(`/admin/${admin._id}`)
      }
      else {
         req.flash("error", "incorrect password or username")
         res.redirect("/admin/login")
      }
   }
    else {
      req.flash("error", "incorrect password or username")
      res.redirect("/admin/login")
   }
}))

router.get("/admin/:id",isloginadmin, (req, res) => {
   const{id}=req.params
   const admin= req.session.admin_id
   res.render("admin/show",{id,admin})
})
router.get("/apassword/:id",isloginadmin,(req,res)=>{
   const{id}=req.params
   res.render("admin/pass",{id})
})
router.post("/apassword/:id",changepassword, catchasync(async(req,res)=>{
   const {id}=req.params
   const{oldpassword,password1}=req.body; 
   const admin= await Admin.findById(id)
   const validadmin= await bcrypt.compare(oldpassword,admin.password);
   if(validadmin){
      const pass= await bcrypt.hash(password1,12)
     const add= await Admin.findByIdAndUpdate(id,{password:pass})
      req.flash("success","succesfully updated")
      res.redirect(`/admin/${id}`)
   }  else{
       req.flash("error","incorrect password")
       res.redirect(`/admin/${id}`)
   }
}))
router.get("/admin/addrole/:id",isloginadmin, catchasync(async (req, res) => {
   const {id}=req.params
   const numdoctor = await Check.count({ role: "doctor" })
   const numstaff= await Check.count({role:"staff"})
   const numlabratory= await Check.count({role:"laboratory"})
   res.render("admin/addrole",{numdoctor,numstaff,numlabratory,id})
}))

router.post("/admin/addrole", catchasync(async (req, res) => {
   const admin= req.session.admin_id
   const { username, role } = req.body;
   const add = await Clinic.findOne({ username })
   if (!add) {
      const register = new Clinic({ username, role })
      register.save();
      req.flash("success","successfully assigned")
      res.redirect(`/admin/addrole/${admin[0]}`)
   } else {
      req.flash("error", "username already registred");
      res.redirect(`/admin/addrole/${admin[0]}`)
   }

}))
router.delete("/admin/:id/delete",isloginadmin, catchasync(async(req,res)=>{
   const {id}= req.params;
   const adminid= req.session.admin_id
   const deleterequest= await Request.findOneAndDelete({patientID:id})
   const labdelete= await Lab.findOneAndDelete({patientID:id}) 
   const remove= await Patient.findByIdAndDelete(id)
   res.redirect(`/admin/viewinformation/${adminid[0]}`)
}))
router.delete("/admins/:id/delete",isloginadmin, catchasync(async(req,res)=>{
   const{id}=req.params;
   const adminid= req.session.admin_id
   const deletedoctor= await Request.findOneAndDelete({doctorID:id});
   const deletedoc=await Check.findByIdAndDelete(id);
   res.redirect(`/admin/viewemployee/${adminid[0]}`)
}))
router.delete("/adminss/:id/delete",isloginadmin, catchasync(async(req,res)=>{
   const{id}=req.params;
   const adminid= req.session.admin_id
   const deletedoctor= await Request.findOneAndDelete({labratory:id});
   const deletedoc=await Check.findByIdAndDelete(id);
   res.redirect(`/admin/viewemployee/${adminid[0]}`)
}))
router.delete("/adminsss/:id/delete",isloginadmin, catchasync(async(req,res)=>{
   const{id}=req.params;
   const adminid= req.session.admin_id
   const deletedoc=await Check.findByIdAndDelete(id);
   res.redirect(`/admin/viewemployee/${adminid[0]}`)
}))
router.get("/admin/viewinformation/:id",isloginadmin, catchasync(async (req, res) => {
      const {id}=req.params
      const patient = await Patient.find({})
      const numpatient = await Patient.countDocuments({});
      res.render("admin/viewinfo", { patient, numpatient,id})
   
}))
router.get("/admin/register/:id",isloginadmin, catchasync(async (req, res) => {
   const{id}=req.params
   const numadmin= await Admin.count({})
   res.render("admin/register",{numadmin,id})
}))
router.post("/admin/register/:id",valadmin, catchasync(async (req, res) => {
   const{id}=req.params
   const { username, password } = req.body;
   const find= await Admin.findOne({username})
   if(!find){
      const hash = await bcrypt.hash(password, 12);
      const new1 = new Admin({
         ...req.body,
         password:hash
      }) 
      new1.save();
      req.flash("success","successfully registered")
      res.redirect(`/admin/register/${id}`)
   } else{
      req.flash("error", "username already registered")
      res.redirect(`/admin/register/${id}`)
   }  
}))
router.get("/admin/viewemployee/:id",isloginadmin, catchasync(async(req,res)=>{
   const{id}=req.params;
   const employee= await Check.find({})
   const numemployee=await Check.count({});
   res.render("admin/viewemployee",{employee,numemployee,id})
}))
router.get("/admin/logout/:id", (req, res) => {
   req.session.admin_id = null;
   res.redirect("/")
})


module.exports = router