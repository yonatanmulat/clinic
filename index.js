if(process.env.NODE_ENV !=="production"){
   require("dotenv").config()
}

const express = require("express")
const app = express();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash")
const ejsmate = require("ejs-mate")
const http=require("http");
const server= http.createServer(app);
const{Server}=require("socket.io");
const io= new Server(server)
const methodoverride= require("method-override")
const Errorhander = require("./errorhander");
const clinicrouter = require("./router/clinic")
const Patientrouter = require("./router/patient")
const requestrouter = require("./router/reques")
const adminrouter = require("./router/admin")
const doctorrouter=require("./router/doctor")
const labrouter=require("./router/lab")
const MongoDBstore= require("connect-mongo")
//const dburl='mongodb://localhost:27017/clinic'
const db= process.env.dburl 
const mongoose = require('mongoose');
const { Socket } = require("dgram");
// 'mongodb://localhost:27017/clinic'
mongoose.set('strictQuery', true);
mongoose.connect(db)
   .then(() => {
      console.log("connection done!!")  
   })
   .catch(errr => {
      console.log("no error happen")
      console.log(errr)
   })


const sessionconfig={
   name:"session",
   secret:"mot secret",
   saveUninitialized:true,
   resave:false,
    store:MongoDBstore.create({
      mongoUrl :db,
      touchAfter:24 * 60 * 60,
   }) 
}

app.engine("ejs",ejsmate)
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(session(sessionconfig));
app.use(flash());
app.use(methodoverride('_method'))
app.use(express.static(path.join(__dirname, "public")))

 


app.use((req, res, next) => {
   res.locals.user=req.session.admin_id
   res.locals.doctor=req.session.doctor_id
   res.locals.staff=req.session.staff_id
   res.locals.laboratory=req.session.laboratory_id
   res.locals.success = req.flash("success")
   res.locals.error = req.flash("error")
   next();
})


app.use("/", adminrouter)
app.use("/", clinicrouter)
app.use("/", Patientrouter)
app.use("/", requestrouter)
app.use("/",doctorrouter)
app.use("/",labrouter)

app.all("*",(req,res,next)=>{
   next(new Errorhander(404,"page not found"))
})

app.use((err, req, res, next) => {
   const { status = 404, message = "something is goes wrong" } = err;
   res.status(status).render("error", { err })
})

io.on("connection",(socket)=>{
   socket.on("notification",(msg)=>{
      socket.broadcast.emit("notification",msg)
   });
   socket.on("assignlab",(msg2)=>{
      socket.broadcast.emit("assignlab",msg2)
   });
   socket.on("labresult",(msg3)=>{
      socket.broadcast.emit("labresult",msg3)
   });
   
})


server.listen(3000, () => {
   console.log("succesfully connected to port 3000")
})
