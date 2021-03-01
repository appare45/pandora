import type { AppProps /*, AppContext */ } from 'next/app';
import '../styles/globals.css';
import firebase from 'firebase/app';
import { useEffect } from 'react';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebase.com`,
  databaseUrl: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
