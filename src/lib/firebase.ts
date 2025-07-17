import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBJADj2K2evxz_D9dAs1DPhvx2bhl3DgQs',
  authDomain: 'melive-bogolive.firebaseapp.com',
  databaseURL: 'https://melive-bogolive-default-rtdb.firebaseio.com',
  projectId: 'melive-bogolive',
  storageBucket: 'melive-bogolive.firebasestorage.app',
  messagingSenderId: '307100949664',
  appId: '1:307100949664:web:79437243f939bad82c3dc5',
  measurementId: 'G-NDHMPZ08RF',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
