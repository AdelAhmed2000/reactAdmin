import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyD2MzIOa0Ahl7jljgYt3n2sQ-IGGQJ8jlA",
//   apiKey: processs.env.REACT_APP_FIREBASE_KEY,
//   authDomain: "e-commerc-dashboard.firebaseapp.com",
//   projectId: "e-commerc-dashboard",
//   storageBucket: "e-commerc-dashboard.appspot.com",
//   messagingSenderId: "34704559310",
//   appId: "1:34704559310:web:739abff69f69b976f3949f",
// };

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth();
// export const storage = getStorage(app);

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2nmfWntageH1QqFwnBI1nRJv1ExIk0GE",
  authDomain: "e-commerc-dashboard.firebaseapp.com",
  projectId: "e-commerc-dashboard",
  storageBucket: "e-commerc-dashboard.appspot.com",
  messagingSenderId: "34704559310",
  appId: "1:34704559310:web:569007fd333b4b7ef3949f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
