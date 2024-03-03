import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCJj2YFdl43yrpGgM_HgtHB5158JrK_qzs",
  authDomain: "support-system-1.firebaseapp.com",
  projectId: "support-system-1",
  storageBucket: "support-system-1.appspot.com",
  messagingSenderId: "843635996757",
  appId: "1:843635996757:web:66a9149c067679adc73cdc",
  measurementId: "G-TDTC1FER7N"
};

const app = initializeApp(firebaseConfig);

const database = getAuth();
export default {app, database}