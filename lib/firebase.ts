import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBihukpSoBFphMnUD4bX6gWBC8zVu_76Bs",
  authDomain: "dazzling-being-395413.firebaseapp.com",
  projectId: "dazzling-being-395413",
  storageBucket: "dazzling-being-395413.firebasestorage.app",
  messagingSenderId: "1067678083591",
  appId: "1:1067678083591:web:8baf5d4979ce1dae09d8a2",
  measurementId: "G-GWNVGYWWYB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

export default app
