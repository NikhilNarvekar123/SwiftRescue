// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// import { ref } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xx",
  databaseURL: "xx-default-rtdbxx.com",
  projectId: "swiftrescue-1168c",
  storageBucket: "swiftrescue-1168c.appspot.com",
  messagingSenderId: "588381670426",
  appId: "1:asd5asdasd88381asd670426:webasd:2basddasdbasd79fb70asd27d6dbeb2d5a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// if we are adding db
export const db = getDatabase(app);
