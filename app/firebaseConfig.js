// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import {getAnalytics,isSupported} from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXiKJOq1JCtU3VL-2W6ST6chTEelZLocA",
  authDomain: "my-project-38e9e.firebaseapp.com",
  databaseURL: "https://my-project-38e9e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-project-38e9e",
  storageBucket: "my-project-38e9e.firebasestorage.app",
  messagingSenderId: "1097395079037",
  appId: "1:1097395079037:web:108a84775ad87af3baae14",
  measurementId: "G-8KLDQWSPLS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const firestore = getFirestore(app);
const db = getFirestore(app);
const storage =getStorage(app)
let analytics;
isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  })
  .catch((err) => console.log("Analytics not supported:", err));

export { auth, analytics, storage, db, firestore};
export default app;




