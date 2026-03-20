import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyBRAHufI07Kpe85dIb_EdBKGIy14M0BlHs',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'semiconductor-edu-simul.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'semiconductor-edu-simul',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'semiconductor-edu-simul.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '114729005813',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:114729005813:web:10149d3d6fda8c8cbb0bbc',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-5RMEQ95DFC',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
