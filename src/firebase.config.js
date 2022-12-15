// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAkYT2y_4mCZAB6BiGH3rPkcUEU5od5Vw",
  authDomain: "house-marketplace-app-998bc.firebaseapp.com",
  projectId: "house-marketplace-app-998bc",
  storageBucket: "house-marketplace-app-998bc.appspot.com",
  messagingSenderId: "568989732646",
  appId: "1:568989732646:web:98037ec6ea62786b8f7be7"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore()