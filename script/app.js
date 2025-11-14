import { collection, getDocs, query, orderBy } 
  from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { db } from "./config.js";

// Select the container where blogs will show
const content = document.querySelector(".content");

// Fetch all blogs (all users)
async function loadAllBlogs() {
  try {
    const q = query(collection(db, "blogs"), orderBy("time", "desc"));
    const querySnapshot = await getDocs(q);

    // Clear old cards (if any)
    document.querySelectorAll(".blog-card").forEach(card => card.remove());

    // Loop through all blogs
    querySnapshot.forEach((docSnap) => {
      const blog = docSnap.data();

      // Create blog card
      const card = document.createElement("div");
      card.className = "blog-card";

      card.innerHTML = `
        <div class="blog-header">
          <img src="${blog.userImage || 'https://via.placeholder.com/60'}" 
               alt="Author" class="author-img">
          <div class="blog-info">
            <h4>${blog.title}</h4>
            <p class="author">
              ${blog.userName || "Unknown User"} • 
              ${new Date(blog.time?.seconds * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>

        <p class="blog-text">${blog.blog}</p>
        <a href="#" class="blog-link">see all from this user</a>
      `;

      // Insert before login button
      const loginBtn = document.querySelector(".bottom-btn");
      content.insertBefore(card, loginBtn);
    });

  } catch (error) {
    console.error("Error loading blogs:", error);
  }
}

// Run when page loads
loadAllBlogs();
