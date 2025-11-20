
import { db } from "./config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";


const blogContainer = document.querySelector(".left-content");
const profileCard = document.querySelector(".profile-card");


const uid = new URLSearchParams(window.location.search).get("uid");

if (!uid) {
  blogContainer.innerHTML = "<p>No author specified.</p>";
} else {
  loadAuthorData(uid);
}

// Render a single blog
function renderBlog(blog) {
  const card = document.createElement("div");
  card.className = "blog-card";

  const postDate = blog.time ? new Date(blog.time.seconds * 1000).toLocaleDateString() : "Unknown date";

  card.innerHTML = `
    <div class="author-sec">
      <img src="${blog.userImage || 'https://via.placeholder.com/60'}" alt="Author">
      <div>
        <h4>${blog.title || "Untitled Blog"}</h4>
        <p class="meta">${blog.userName || "Unknown"} • ${postDate}</p>
      </div>
    </div>
    <p class="blog-text">${blog.blog || ""}</p>
  `;

  blogContainer.appendChild(card);
}

// Fetch user profile and blogs
async function loadAuthorData(authorUid) {
  try {
   
    const userQuery = query(collection(db, "users"), where("uid", "==", authorUid));
    const userSnapshot = await getDocs(userQuery);
    let userData = null;

    if (!userSnapshot.empty) {
      userData = userSnapshot.docs[0].data();
      // Fill profile card
      profileCard.innerHTML = `
        <img src="${userData.profile || 'https://via.placeholder.com/100'}" class="profile-img" alt="Author">
        <p class="email">${userData.email || ""}</p>
        <h3>${userData.firstname || "Unknown"} ${userData.lastname || ""}</h3>
      `;
      profileCard.dataset.filled = "true";
    }

 
    const blogQuery = query(collection(db, "blogs"), where("uid", "==", authorUid));
    const blogSnapshot = await getDocs(blogQuery);

    if (blogSnapshot.empty) {
      blogContainer.innerHTML = "<p>No blogs found for this author.</p>";
      return;
    }

    // Sort blogs by time descending
    const blogs = blogSnapshot.docs.map(doc => doc.data());
    blogs.sort((a, b) => b.time.seconds - a.time.seconds);

    // Render each blog
    blogs.forEach(blog => renderBlog(blog));

  } catch (err) {
    console.error("Error loading author data:", err);
    blogContainer.innerHTML = "<p>Error loading blogs.</p>";
  }
}
