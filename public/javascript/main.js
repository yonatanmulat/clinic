

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */







const crtform = document.querySelector(".crtact");
crtform.addEventListener("submit" , function (v) {
  const p = document.querySelector(".error")
  const s = document.querySelector(".sucess")
var newPassword = crtform.elements.newpswrd.value
var confirmPassword = crtform.elements.confpswrd.value
if(!(newPassword === confirmPassword)){
  v.preventDefault()
  s.classList.add("none")
  p.classList.remove("none") 
}
})




function myFunction(e) {
   document.getElementById("myDropdown").classList.toggle("show");
  // e.preventDefault();
 }


 // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
   if (!event.target.matches('.dropbtn')) {
     var dropdowns = document.getElementsByClassName("dropdown-content");
     var i;
     for (i = 0; i < dropdowns.length; i++) {
       var openDropdown = dropdowns[i];
       if (openDropdown.classList.contains('show')) {
         openDropdown.classList.remove('show');
       }
     }
   }
 } 
 function ChangeFunction(event) {

  

  
 document.getElementById("nwpswrd").classList.add("see");
 event.preventDefault();
 
}
 const clicke = document.querySelector(".clicke");
 clicke.onclick = function(event) {
  if (!event.target.matches('.cpwrd')) {
    const downs = document.getElementsByClassName("crtact");
    var i;
    for (i = 0; i < downs.length; i++) {
      const openDro = downs[i];
      if (openDro.classList.contains('see')) {
        openDro.classList.remove('see');
      }
    }
  }
}  