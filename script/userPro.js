    import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
    import { auth, db } from "./config.js";
    import { signOut, onAuthStateChanged, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

    // DOM Elements
    const logoutBtn = document.querySelector("#logoutBtn");
    const profilePic = document.querySelector(".profile-pic");
    const nameDiv = document.querySelector(".name");

    const oldPassInput = document.querySelector("#oldPassword");
    const newPassInput = document.querySelector("#newPassword");
    const repeatPassInput = document.querySelector("#repeatPassword");
    const updateBtn = document.querySelector("#updatePasswordBtn");

    let currentUserData = null;

 
    logoutBtn.addEventListener("click", () => {
      signOut(auth)
        .then(() => window.location = "login.html")
        .catch(() => alert("Error logging out"));
    });

    onAuthStateChanged(auth, async (user) => {
      if (!user) return window.location = "login.html";

      try {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          currentUserData = querySnapshot.docs[0].data();

          // Set profile pic from Cloudinary URL or Firestore
          profilePic.src = currentUserData.profile || 'default-avatar.png';

      
          nameDiv.textContent = `${currentUserData.firstname} ${currentUserData.lastname}`;
        } else {
          nameDiv.textContent = "User";
          profilePic.src = 'default-avatar.png';
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        nameDiv.textContent = "User";
        profilePic.src = 'default-avatar.png';
      }
    });


    updateBtn.addEventListener("click", async () => {
      const oldPass = oldPassInput.value;
      const newPass = newPassInput.value;
      const repeatPass = repeatPassInput.value;

      if (!oldPass || !newPass || !repeatPass) return alert("Please fill all fields!");
      if (newPass !== repeatPass) return alert("New passwords do not match!");

      const user = auth.currentUser;
      if (!user) return;

      const credential = EmailAuthProvider.credential(user.email, oldPass);

      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPass);
        alert(" Password updated successfully!");
        oldPassInput.value = newPassInput.value = repeatPassInput.value = "";
      } catch (err) {
        console.error(err);
        alert("Error updating password: " + err.message);
      }
    });


    const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
menuToggle.addEventListener("click", () => navMenu.classList.toggle("active"));
