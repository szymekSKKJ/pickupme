import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYwjwbmbhiQP2ohtQwQ3-yEppq2kKpxFQ",
  authDomain: "pick-up-me-eb55c.firebaseapp.com",
  projectId: "pick-up-me-eb55c",
  storageBucket: "pick-up-me-eb55c.appspot.com",
  messagingSenderId: "17593640294",
  appId: "1:17593640294:web:6a287af10dba22739554a7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
