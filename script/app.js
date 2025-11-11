import { 
  collection, addDoc, Timestamp, getDocs, query, where, 
  deleteDoc, updateDoc, doc 
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js"; 
import { auth, db } from "./config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const form = document.querySelector("#form");
const blogTitle = document.querySelector("#title");
const blogContent = document.querySelector("#post");
const blogList = document.querySelector(".blog-list");
const logoutBtn = document.querySelector("#logoutBtn");
const userProfile = document.querySelector("#userProfile");

let userUID = null;
let blogs = []; // Array to store blogs locally

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => window.location = "login.html")
    .catch((err) => alert("Error logging out"));
});

// Check user login
onAuthStateChanged(auth, async (user) => {
  if (user) {
    userUID = user.uid;

    // Fetch user name
    try {
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        userProfile.textContent = userData.firstname + " " + userData.lastname;
      } else {
        userProfile.textContent = "User";
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      userProfile.textContent = "User";
    }

    // Load user's blogs
    await loadBlogs();
  } else {
    window.location = "login.html";
  }
});

// Load blogs from Firestore
async function loadBlogs() {
  if (!userUID) return;

  const q = query(collection(db, "blogs"), where("uid", "==", userUID));
  blogs = []; // reset array
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docSnap) => {
    blogs.push({ ...docSnap.data(), docId: docSnap.id });
  });

  renderBlogs();
}

// Add new blog
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!userUID) return;

  const blogData = {
    title: blogTitle.value,
    blog: blogContent.value,
    time: Timestamp.fromDate(new Date()),
    uid: userUID
  };

  try {
    const docRef = await addDoc(collection(db, "blogs"), blogData);
    blogs.push({ ...blogData, docId: docRef.id });
    renderBlogs();
    form.reset();
  } catch (err) {
    console.error("Error adding blog:", err);
  }
});

// Render blogs
function renderBlogs() {
  blogList.innerHTML = ""; // clear previous blogs

  blogs.forEach((post) => {
    
    const blogCard = document.createElement("div");
    blogCard.className = "blog-card";

    blogCard.innerHTML = `
      <div class="user-info">
        <img src="" alt="User" class="user-img">
        <h4>${post.title}</h4>
      </div>
      <p>${post.blog}</p>
      <div class="actions">
        <button class="editBtn">Edit</button>
        <button class="deleteBtn">Delete</button>
      </div>
    `;

    // Optional: Add Delete functionality
    blogCard.querySelector(".deleteBtn").addEventListener("click", async () => {
      try {
        await deleteDoc(doc(db, "blogs", post.docId));
        blogs = blogs.filter(b => b.docId !== post.docId);
        renderBlogs();
      } catch (err) {
        console.error("Error deleting blog:", err);
      }
    });

    blogList.appendChild(blogCard);
  });
}

// Toggle mobile menu
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
menuToggle.addEventListener("click", () => navMenu.classList.toggle("active"));
