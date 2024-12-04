// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0N40g9VRFomf0VAq-Z_wyhIBrAvKdy0w",
  authDomain: "splitdiff-54b71.firebaseapp.com",
  projectId: "splitdiff-54b71",
  storageBucket: "splitdiff-54b71.firebasestorage.app",
  messagingSenderId: "154935162941",
  appId: "1:154935162941:web:37edae5bdecde843175254",
  measurementId: "G-LEKCNZ3WDB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);