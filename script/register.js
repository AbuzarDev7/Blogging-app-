import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { auth } from "./config.js";

import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { db } from "./config.js";


let img;

var myWidget = cloudinary.createUploadWidget(
  {
    cloudName: 'dfu6dxt8o',
    uploadPreset: 'user-img',
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      console.log("Upload success:", result.info);
      img = result.info.secure_url;
    }
  }
);

document.getElementById("upload_widget").addEventListener("click", function () {
  myWidget.open();
}, false);

const form = document.querySelector("#form");
const userName = document.querySelector("#user-name");
const email = document.querySelector("#user-email");
const userLastname = document.querySelector("#user-lastname");
const password = document.querySelector("#user-password");
const confirmPassword = document.querySelector("#user-confirm");

form.addEventListener("submit", (eve) => {
  eve.preventDefault();

  if (!img) {
    alert("Please upload your profile image!");
    return;
  }

  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log("User created:", user.uid);

      try {
        const docRef = await addDoc(collection(db, "users"), {
          firstname: userName.value,
          lastname: userLastname.value,
          email: email.value,
          profile: img,
          uid: user.uid,
        });

        console.log("Document written with ID: ", docRef.id);
        window.location = "login.html";
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    })
    .catch((error) => {
      console.log("Signup error:", error.message);
    });
});
