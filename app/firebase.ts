// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBN9Hgk7fxiQIg9Fnu0EwxLs6W1RDDk_YQ",
  authDomain: "image-76cf3.firebaseapp.com",
  projectId: "image-76cf3",
  storageBucket: "image-76cf3.appspot.com",
  messagingSenderId: "63034161453",
  appId: "1:63034161453:web:cb84ed1dc4ef474bd5fba4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage=getStorage(app)