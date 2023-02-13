const socket=io();
const btn= document.querySelector(".send");
btn.addEventListener("click",()=>{
   socket.emit("assignlab","new laboratory test");
})

