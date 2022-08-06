import firebase from "firebase";
import "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyCG1EqzGESvuxrwzwOXDc2aBMlqDxpDm6w",

  authDomain: "freeway-d4894.firebaseapp.com",

  projectId: "freeway-d4894",

  storageBucket: "freeway-d4894.appspot.com",

  messagingSenderId: "979967180165",

  appId: "1:979967180165:web:844d0ce451f30930e658ec",

  measurementId: "G-V5RTLZXTQW"

};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage()

export  { db, auth, storage };
