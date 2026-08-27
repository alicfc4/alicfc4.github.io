document.getElementById("year").textContent=new Date().getFullYear();
const t=document.querySelector(".menu-toggle"),n=document.querySelector(".nav-links");
t.addEventListener("click",()=>n.classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>n.classList.remove("open")));