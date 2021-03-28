import { useContext, useEffect, useState } from 'react';
import firebase from '../utils/firebase';
import router from 'next/router';
import { AuthContext } from '../contexts/Auth';

export default function LoginFront() {
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    currentUser !== null && router.push('/');
    setLoginStatus(currentUser);
  }, [currentUser]);

  const login = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().languageCode = 'ja';
    firebase.auth().signInWithRedirect(provider);
  };

  const [loginStatus, setLoginStatus] = useState<
    firebase.User | null | undefined
  >(null);

  return (
    <div className="flex row justify-center items-center flex-col m-0 w-full h-screen">
      <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 p-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <p className="leading-10">ログインが必要です</p>
      <button
        className={`flex items-center bg-blue-50 p-2 px-4 rounded shadow m-2 disabled:opacity-50 ${
          loginStatus === undefined && 'opacity-50'
        }`}
        onClick={() => login()}
        disabled={currentUser === undefined}
      >
        <div className="pr-1">
          {currentUser === undefined ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#000000"
              className="animate-spin h-5 text-gray-900 mx-1"
            >
              <rect fill="none" height="24" width="24" />
              <path d="M2.88,7.88l1.54,1.54C4.15,10.23,4,11.1,4,12c0,4.41,3.59,8,8,8s8-3.59,8-8s-3.59-8-8-8c-0.9,0-1.77,0.15-2.58,0.42 L7.89,2.89C9.15,2.32,10.54,2,12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12C2,10.53,2.32,9.14,2.88,7.88z M7,5.5 C7,6.33,6.33,7,5.5,7S4,6.33,4,5.5S4.67,4,5.5,4S7,4.67,7,5.5z" />
            </svg>
          ) : (
            <svg
              width="24"
              hanging="24"
              viewBox="0 0 256 262"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
              className="w-4 pt-1 m-1"
            >
              <g>
                <path
                  d="M255.878,133.451 C255.878,122.717 255.007,114.884 253.122,106.761 L130.55,106.761 L130.55,155.209 L202.497,155.209 C201.047,167.249 193.214,185.381 175.807,197.565 L175.563,199.187 L214.318,229.21 L217.003,229.478 C241.662,206.704 255.878,173.196 255.878,133.451"
                  fill="#4285F4"
                ></path>
                <path
                  d="M130.55,261.1 C165.798,261.1 195.389,249.495 217.003,229.478 L175.807,197.565 C164.783,205.253 149.987,210.62 130.55,210.62 C96.027,210.62 66.726,187.847 56.281,156.37 L54.75,156.5 L14.452,187.687 L13.925,189.152 C35.393,231.798 79.49,261.1 130.55,261.1"
                  fill="#34A853"
                ></path>
                <path
                  d="M56.281,156.37 C53.525,148.247 51.93,139.543 51.93,130.55 C51.93,121.556 53.525,112.853 56.136,104.73 L56.063,103 L15.26,71.312 L13.925,71.947 C5.077,89.644 0,109.517 0,130.55 C0,151.583 5.077,171.455 13.925,189.152 L56.281,156.37"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M130.55,50.479 C155.064,50.479 171.6,61.068 181.029,69.917 L217.873,33.943 C195.245,12.91 165.798,0 130.55,0 C79.49,0 35.393,29.301 13.925,71.947 L56.136,104.73 C66.726,73.253 96.027,50.479 130.55,50.479"
                  fill="#EB4335"
                ></path>
              </g>
            </svg>
          )}
        </div>
        Googleでログイン
      </button>
      <p></p>
    </div>
  );
}
