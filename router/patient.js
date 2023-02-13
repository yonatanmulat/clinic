const express = require("express")
const router = express.Router();
const Patient = require("../model/patient")
const { isloginstaff } = require("../middleware");
const catchasync = require("../catchasync");
const {valpatient}=require("../joi")

router.get("/register", isloginstaff, (req, res) => {
   res.render("patient/patient")
})
router.post("/register",valpatient, catchasync(async (req, res) => {
   const {  studentid } = req.body;
   const add= req.session.staff_id;
   const existuser = await Patient.findOne({ studentid });
   if (!existuser) {
      const patient = new Patient({ ...req.body })
      await patient.save();
      req.flash("success", "succesfully created")
      res.redirect(`/request/${add[0]}`)
   } else {
      req.flash("error", "you are already registered")
      res.redirect("/register")
   }
}))
router.post("/login", catchasync(async (req, res) => {
   const { studentid, date } = req.body;
   const student = await Patient.findOne({ studentid })
   if (student) {
      res.redirect(`/login/${student._id}/doctor`)
   } else {
      req.flash("error","patient not registered")
      res.redirect("/register")
   }

}))

module.exports = router;