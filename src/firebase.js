import firebase from "firebase/app";
import "firebase/firestore";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCs1cXr4gZQP_aTvqVPxrVNLW3dyvNJYE8",
  authDomain: "fb-crud-react-f79c7.firebaseapp.com",
  projectId: "fb-crud-react-f79c7",
  storageBucket: "fb-crud-react-f79c7.appspot.com",
  messagingSenderId: "276312197163",
  appId: "1:276312197163:web:b6c6ba8ffeeb533c28c26e",
};
// Initialize Firebase

const fb = firebase.initializeApp(firebaseConfig);

export const db = fb.firestore();
