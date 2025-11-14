
import {signInWithEmailAndPassword , sendPasswordResetEmail} from "//www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {auth,provider,db} from "./config.js"


const form = document.querySelector("#form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");


form.addEventListener("submit" ,(e)=>{
    e.preventDefault();
    signInWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {

    const user = userCredential.user;
    console.log(user);
    window.location = "home.html"
    

  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Plzz Correct your Password",
  footer: '<a href="#">Why do I have this issue?</a>'
});
  });
})

const link  = document.querySelector(".links");


link.addEventListener("click" ,()=>[
    sendPasswordResetEmail(auth,prompt("Enter your email"))
    .then(()=>{
    console.log("send email succesfully");
    Swal.fire({
  title: "Succesfull!",
  text: "send email succesfully",
  icon: "success"
});

    })
    .catch(()=>{
          const errorCode = error.code;
    const errorMessage = error.message;
 console.log(errorMessage);
 
    })
])

const googleBtn = document.querySelector("#google-login");
googleBtn.addEventListener("click" ,()=>{
    signInWithPopup(auth,provider)
    .then((result)=>{
    const user = result.user;
    console.log(user);
    window.location = "home.html"
    })
    .catch((error)=>{
    const errorCode = error.code;
    const errorMessage = error.message;
   console.log(errorMessage);

    })
})