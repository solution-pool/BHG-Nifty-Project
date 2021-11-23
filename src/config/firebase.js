// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsfalt9JpOmnRWNsoGftOYqM0jvxhsHi4",
  authDomain: "nifty-e01fb.firebaseapp.com",
  projectId: "nifty-e01fb",
  storageBucket: "nifty-e01fb.appspot.com",
  messagingSenderId: "992212941623",
  appId: "1:992212941623:web:2605fdb4283acc1bc7b8b2",
  measurementId: "G-V88XF0HRZR"
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig)

export default firebase
export const database = firebase.database()
export const storage = firebase.storage()
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
