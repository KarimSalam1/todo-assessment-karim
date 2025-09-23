import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxYKdSzHlsSun9noEWeUPDMVOr9a6ip2c",
  authDomain: "todo-assessment-1f144.firebaseapp.com",
  projectId: "todo-assessment-1f144",
  storageBucket: "todo-assessment-1f144.firebasestorage.app",
  messagingSenderId: "134048965072",
  appId: "1:134048965072:web:18bee9a6c83881e399d9d5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
