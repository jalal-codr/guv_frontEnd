// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {GoogleAuthProvider, getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnyAevDB7kullbr7h56wMz-9dk3h_MKts",
  authDomain: "main-prod-16553.firebaseapp.com",
  projectId: "main-prod-16553",
  storageBucket: "main-prod-16553.appspot.com",
  messagingSenderId: "676697655762",
  appId: "1:676697655762:web:618b64b2c2806e257ea00b",
  measurementId: "G-6PY83TVGBB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider();
