const express = require("express");
const router = express.Router();
const Request = require("../model/request")
const Patient = require("../model/patient")
const Lab = require("../model/labratory")
const Result = require("../model/result");
const bcrypt = require("bcryptjs")
const Check = require("../model/check")
const Clinic = require("../model/clinic")
const catchasync = require("../catchasync");
const { isloginlabratory } = require("../middleware");
const { valid, changepassword } = require("../joi");

router.get("/register/labratory", (req, res) => {
   res.render("labratory/register")
})
router.post("/register/labratory", valid, catchasync(async (req, res) => {
   const { username, password } = req.body;
   const registered = await Check.findOne({ username })
   const labratory = await Clinic.findOne({ username })
   if (labratory && labratory.role == "laboratory" && !registered) {
      const hash = await bcrypt.hash(password, 12)
      const validlabratory = new Check({
         username, ...req.body,
         role: labratory.role, password: hash
      })
      validlabratory.save();
      req.flash("success", "successfully registered")
      res.redirect("/login/labratory")
   } else {
      req.flash("error", "unregisterd username")
      res.redirect("/register/labratory")
   }
}))

router.get("/login/labratory", (req, res) => {
   res.render("labratory/labratorylogin")
})
router.post("/login/labratory", catchasync(async (req, res) => {
   const { username, password } = req.body;
   const lab = await Check.findOne({ username })
   if (lab && lab.role == "laboratory") {
      const validlabratory = await bcrypt.compare(password, lab.password)
      if (validlabratory) {
         req.session.laboratory_id = [lab._id, lab.firstname, lab.lastname]
         req.flash("success", `welcome dear ${lab.firstname}`)
         res.redirect(`/login/lab/${lab._id}`)
      } else {
         req.flash("error", "incorrect username or password")
         res.redirect("/login/labratory")
      }
   } else {
      req.flash("error", "incorrect username or password")
      res.redirect("/login/labratory")
   }
}))
router.get("/login/lab/:labid", isloginlabratory, catchasync(async (req, res) => {
   const { labid } = req.params
   const labratory = await Check.findById(labid)
   const data = await Lab.find({ labratory: labratory }).populate("patientID");
   if (data.length) {
      arr = new Array();
      data.map(e => {
         let new_data = {
            data: e.patientID,
            date: e.date
         }
         arr.push(new_data)
      })
      res.render("labratory/show", { arr, labid, labratory })
   }
   else {
      res.render("labratory/nowork", { labratory, labid })
   }
}))

router.get("/changepasswords/:id", isloginlabratory, (req, res) => {
   const { id } = req.params
   res.render("labratory/pass", { id })
})
router.post("/changepasswords/:id", changepassword, catchasync(async (req, res) => {
   const { id } = req.params;
   const { oldpassword, password1 } = req.body;
   const lab = await Check.findById(id);
   const validpassword = await bcrypt.compare(oldpassword, lab.password)
   if (validpassword) {
      const hash = await bcrypt.hash(password1, 12);
      const update = await Check.findByIdAndUpdate(id, { password: hash });
      req.flash("success", "successfully updated")
      res.redirect(`/login/lab/${id}`)
   } else {
      req.flash("error", "incorrect password");
      res.redirect(`/login/lab/${id}`)
   }
}))
router.get("/login/:id/lab/:labid", isloginlabratory, catchasync(async (req, res) => {
   const { id, labid } = req.params;
   const test = await Lab.find({ patientID: id }).populate("test");
   if (test) {
      arr = new Array();
      test.map((e) => {
         arr.push(e.test);
      })
      res.render("labratory/see", { arr, id, labid })
   }
}))

router.post("/login/:id/lab/:labid", catchasync(async (req, res) => {
   const { id, labid } = req.params
   const sentval = await Request.find({ patientID: id }).populate("result")
   const resultvalue = new Result({ ...req.body })
   resultvalue.save();
   sentval.map((e) => {
      e.result.push(resultvalue);
      e.save();
   })
   await Lab.findOneAndDelete({ patientID: id })
   req.flash("success", "succesfully sent result")
   res.redirect(`/login/lab/${labid}`)
}))
router.get("/laboratory/logout/:id", (req, res) => {
   req.session.laboratory_id = null;
   res.redirect("/")
})

module.exports = router;