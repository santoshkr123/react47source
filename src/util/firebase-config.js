import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC6uNKV8VcYoNKaBxYlhFC1sTmDY8_Yhrk",
  authDomain: "shop1test.firebaseapp.com",
  projectId: "shop1test",
  storageBucket: "shop1test.appspot.com",
  messagingSenderId: "258139575880",
  appId: "1:258139575880:web:44e20c855763e288606a7d",
  measurementId: "G-YTX0DW03KZ"
};

const firebaseAppConfig = initializeApp(firebaseConfig);
export default firebaseAppConfig