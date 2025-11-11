  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
  import { getAuth,GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyB42FGDZM5tTWiFMENUJZLVq1sPGwQmf4g",
    authDomain: "bloging-app-e1be7.firebaseapp.com",
    projectId: "bloging-app-e1be7",
    storageBucket: "bloging-app-e1be7.firebasestorage.app",
    messagingSenderId: "948207711989",
    appId: "1:948207711989:web:3b93ab26f4dbb9a18cb7bc",
    measurementId: "G-EEZ2F8R11X"
  };

  const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app)
   export   const db = getFirestore(app);
   export const provider = new GoogleAuthProvider();