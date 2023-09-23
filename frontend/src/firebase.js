// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMQolx6MESzGcoxjqmkkxcybgyd6Fy7Xg",
  authDomain: "swiftrescue-1168c.firebaseapp.com",
  databaseURL: "https://swiftrescue-1168c-default-rtdb.firebaseio.com",
  projectId: "swiftrescue-1168c",
  storageBucket: "swiftrescue-1168c.appspot.com",
  messagingSenderId: "588381670426",
  appId: "1:588381670426:web:2bdb79fb7027d6beb2d5a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// if we are adding db
const db = getFirestore(app);
export default db;