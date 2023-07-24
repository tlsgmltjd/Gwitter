import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyA46xKeedkfGbg1ObmGWmHh66IYsyG40uY",
  authDomain: "gwitter-38f80.firebaseapp.com",
  projectId: "gwitter-38f80",
  storageBucket: "gwitter-38f80.appspot.com",
  messagingSenderId: "1043029126002",
  appId: "1:1043029126002:web:527d617debc8e4a0f90beb",
  measurementId: "G-H9W9L7VH39",
};

firebase.initializeApp(firebaseConfig);

export const authService = getAuth();
