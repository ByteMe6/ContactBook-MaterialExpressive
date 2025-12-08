// src/firebase/firebase.js

// 1️⃣ Импорты из Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, serverTimestamp } from "firebase/database";

// 2️⃣ Конфиг проекта (замени на свой из Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyAgf8H8TskHD1pXrVK1H8mdjIjLhMGzaOA",
  authDomain: "contactbook-3ea5d.firebaseapp.com",
  databaseURL: "https://contactbook-3ea5d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "contactbook-3ea5d",
  storageBucket: "contactbook-3ea5d.firebasestorage.app",
  messagingSenderId: "461845570644",
  appId: "1:461845570644:web:b604be2565048e7355f9c1",
  measurementId: "G-3QXPNYDZFP"
};


// 3️⃣ Инициализация приложения Firebase
const app = initializeApp(firebaseConfig);

// 4️⃣ Экспорт объектов для использования в проекте
export const auth = getAuth(app);       // для регистраций и логина
export const db = getDatabase(app);     // для работы с Realtime Database
export const ts = serverTimestamp;      // если нужно ставить createdAt