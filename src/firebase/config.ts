import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA2oPHk-t1pE8tQNy3mE8bN9cWPfmR1eks",
  authDomain: "bee-queen.firebaseapp.com",
  projectId: "bee-queen",
  storageBucket: "bee-queen.appspot.com",
  messagingSenderId: "737563893398",
  appId: "1:737563893398:web:60b4ff60bc101eda0facb7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const projectStorage = firebase.storage();
const projectFirestore = firebase.firestore();

export { projectStorage, projectFirestore };