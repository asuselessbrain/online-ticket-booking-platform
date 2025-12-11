// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrfYCM_B-WYiX7Rf8LZHNIDoSmt3RspLM",
  authDomain: "online-ticket-system-d45dd.firebaseapp.com",
  projectId: "online-ticket-system-d45dd",
  storageBucket: "online-ticket-system-d45dd.firebasestorage.app",
  messagingSenderId: "110374074758",
  appId: "1:110374074758:web:ae6b6a24ccd02ee71f5407"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)