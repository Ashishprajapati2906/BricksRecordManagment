
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDduQ9Mo6lWUU71aTWJxPYOW5lUF_kJJs0",
	authDomain: "bricksdatabase.firebaseapp.com",
	projectId: "bricksdatabase",
	storageBucket: "bricksdatabase.firebasestorage.app",
	messagingSenderId: "243412766348",
	appId: "1:243412766348:web:8d0ca8c40f7c99a24a35a9",
	measurementId: "G-KQYY7T14G2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);


export { db, addDoc, collection }