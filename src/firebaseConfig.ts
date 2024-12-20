// filepath: /c:/Pierre_Project/friend-ranking-app/src/firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCbmytjsWo-HiCtcyREyiB9VEXABD6K3Hk",
    authDomain: "friendrankingapp.firebaseapp.com",
    projectId: "friendrankingapp",
    storageBucket: "friendrankingapp.firebasestorage.app",
    messagingSenderId: "872242448089",
    appId: "1:872242448089:web:53f63aca209d84da0620c8",
    measurementId: "G-RL4LE4LSDF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };