const express = require("express");
const router = express.Router();
const Patient = require("../model/patient")
const Check = require("../model/check")
const Request = require("../model/request");
const Clinic = require("../model/clinic")
const bcrypt=require("bcryptjs")
const { islogindoctor } = require("../middleware")
const catchasync = require("../catchasync");
const Test = require("../model/test");
const Lab = require("../model/labratory");
const PatientResult = require("../model/patientresult");
const Errorhander = require("../errorhander");
const {valid,changepassword}=require("../joi")

router.get("/register/doctor", (req, res) => {
   res.render("doctor/register")
})
router.post("/register/doctor", valid, catchasync(async (req, res) => {
   const { username, password } = req.body;
   const validdoctor = await Clinic.findOne({ username })
   const registered = await Check.findOne({ username })
   if (validdoctor && validdoctor.role == "doctor" && !registered) {
      const hash= await bcrypt.hash(password,12)
      const check = new Check({ username, ...req.body, 
         role: validdoctor.role,
         password:hash
      });
      check.save();
      req.flash("success", "successfully registered")
      res.redirect("/login/doctor")
   } else {
      req.flash("error", "unregistred username")
      res.redirect("/register/doctor")
   }
})) 

router.get("/login/doctor", (req, res) => {
   res.render("doctor/doctor")
})
router.post("/login/doctor", catchasync(async (req, res) => {
   const { username, password } = req.body
   const checkdoctor = await Check.findOne({ username })
   if (checkdoctor && checkdoctor.role == "doctor") {
      const validpassword= await bcrypt.compare(password,checkdoctor.password)
      if(validpassword){
         req.session.doctor_id=[checkdoctor._id,checkdoctor.firstname,checkdoctor.lastname]
         req.flash("success", `welcome doctor ${checkdoctor.firstname}`)
         res.redirect(`/doctor/${checkdoctor._id}`)
      } else{
      req.flash("error", "incorrect username or password")
      res.redirect("/login/doctor")
      }
   } else {
      req.flash("error", "incorrect username or password")
      res.redirect("/login/doctor")
   }

}
))
router.get("/doctor/:id", islogindoctor, (req, res) => {
   const { id } = req.params;
   res.render("doctor/main", { id })
})
router.get("/dpassword/:id",islogindoctor, (req, res) => {
   const {id}=req.params
   res.render("doctor/pass",{id})
})

router.post("/dpassword/:id",changepassword, catchasync(async (req, res) => {
  const {id}=req.params
  const{oldpassword,password1}=req.body;
  const doctor= await Check.findById(id)
  const validpassword= await bcrypt.compare(oldpassword,doctor.password);
  if(validpassword){
     const hash= await bcrypt.hash(password1,12)
     const update= await Check.findByIdAndUpdate(id,{password:hash})
     req.flash("success","successfully updated")
     res.redirect(`/doctor/${id}`)
  } else{
   req.flash("error","incorrect password");
   res.redirect(`/doctor/${id}`)
  }
}))


router.get("/medical", islogindoctor, catchasync(async (req, res) => {
   const patient = await Patient.find({}).populate("medicalhistory")
   if (patient) {
      arr = new Array();
      patient.map((e) => {
         if (e.medicalhistory.length) {
            arr.push(e)
         }

      })
      res.render("doctor/med", { arr })
   }
}))
router.get("/p/:id", islogindoctor, catchasync(async (req, res) => {
   const { id } = req.params
   const patient = await Patient.findById(id).populate("medicalhistory")
   if (patient.medicalhistory.length) {
      arr = new Array();
      patient.medicalhistory.map((e) => {
         arr.push(e)
      })
      res.render("doctor/detail", { arr })
   } else {
      req.flash("error", "no medicalhistory of patient")
      res.redirect("/medical")
   }
}))
router.post("/med/search", catchasync(async (req, res) => {
   const { studentid } = req.body;
   const patient = await Patient.findOne({ studentid }).populate("medicalhistory")
   if (patient && patient.medicalhistory.length) {
      arr = new Array();
      patient.medicalhistory.map((e) => {
         arr.push(e)
      })
      res.render("doctor/search", { patient, arr })
   }
   else {
      req.flash("error", "no medicalhistory of patient")
      res.redirect("/medical")
   }
}))
router.get("/login/doctor/:id", islogindoctor, catchasync(async (req, res) => {
   const { id } = req.params
   const request = await Request.find({ doctorID: id }).populate("patientID")
   if (request.length) {
      arr = new Array();
      request.map(e => {
         let new_data = {
            data : e.patientID, 
            date : e.date
         }
         arr.push(new_data);
      })
      res.render("doctor/show", { arr, id });
   }
   else {
      res.render("doctor/nowork",{id})
   }
})) 
router.get("/login/:id/d/:docid", islogindoctor, catchasync(async (req, res) => {
   const { id, docid } = req.params;
   const patient = await Patient.findById(id).populate("medicalhistory")
   if (patient.medicalhistory.length) {
      arr = new Array();
      patient.medicalhistory.map((e) => {
         arr.push(e)
      })
      res.render("doctor/detail", { arr })
   } else {
      req.flash("error", "no medicalhistory of patient")
      res.redirect(`/login/doctor/${docid}`)
   }
}))
router.get("/login/:id/result/:docid", islogindoctor, catchasync(async (req, res) => {
   const { id, docid } = req.params
   const result = await Request.findOne({ patientID: id }).populate("result")

   if (result.result.length) {
      arr = new Array();
      result.result.map((e) => {
         arr.push(e);
      })
      console.log(arr)
      res.render("doctor/result", { arr, id, docid })
   }
   else {
      req.flash("error", "no result send")
      res.redirect(`/login/doctor/${docid}`)
   }

}))

router.post("/login/:id/doc/:docid", catchasync(async (req, res) => {
   const { id, docid } = req.params;
   const newresult = new PatientResult({ ...req.body })
   await newresult.save();
   const patient = await Patient.findById(id).populate("medicalhistory");
   patient.medicalhistory.push(newresult);
   await patient.save();
   await Request.findOneAndDelete({ patientID: id })
   res.redirect(`/login/doctor/${docid}`)
}))

router.get("/login/:pid/doctor/:id", islogindoctor, catchasync(async (req, res) => {
   const { pid, id } = req.params;
   const labratorys = await Check.find({ role: "laboratory" })
   const request = await Request.find({ doctorID: id }).populate("patientID")
   if (request) {
      arr = new Array();
      request.map(e => {
         arr.push(e.patientID)
         console.log(e.date)
      })
      res.render("doctor/assignlab", { arr, id, pid, labratorys });
   }

}))
router.post("/login/:pid/doctor/:id", catchasync(async (req, res) => {
   const { pid, id } = req.params;
   const { username } = req.body;
   const labb = await Check.findOne({ username })
   const patient = await Patient.findById(pid);
   const test = new Test({ ...req.body })
   await test.save();
   const lab = new Lab({ patientID: patient, test: test, labratory: labb })
   await lab.save();
   req.flash("success", "succesfully assign to labratory")
   res.redirect(`/login/doctor/${id}`)
}))
router.get('/doctor/logout/:id',islogindoctor, (req, res) => {
    req.session.doctor_id=null;
    res.redirect("/")
})


module.exports = router 