import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from 'firebase/firestore'
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAV01xViJourXFcKddwZ3afvk7BF9n_ugo",
  authDomain: "scrapify-d8c70.firebaseapp.com",
  projectId: "scrapify-d8c70",
  storageBucket: "scrapify-d8c70.appspot.com",
  messagingSenderId: "998520610340",
  appId: "1:998520610340:web:17c9e5deefe7d5c393c2b1",
  measurementId: "G-7DE5M4GPFT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const imgDB = getStorage(app);