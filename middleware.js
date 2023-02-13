module.exports.isloginstaff=(req,res,next)=>{
   if(!req.session.staff_id){
      req.flash("error","you need to login first")
      res.redirect("/login/staff") 
   }
   next();
}

module.exports.islogindoctor=(req,res,next)=>{
  if(!req.session.doctor_id){
   req.flash("error","you need to login first")
   res.redirect("/login/doctor")
  }
   next();
}
module.exports.isloginlabratory=(req,res,next)=>{
   if(!req.session.laboratory_id){
      req.flash("error","you need to login first")
      res.redirect("/login/labratory")
   }
   next();
}

module.exports.isloginadmin=(req,res,next)=>{
   if(!req.session.admin_id){
      req.flash("error", "you need to login first")
      res.redirect("/admin/login")
   }
   next();
}