import { useContext, useEffect, useState } from 'react';
import firebase from '../utils/firebase';
import router from 'next/router';
import { AuthContext } from '../contexts/Auth';

export default function LoginFront() {
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    !!currentUser && router.push('/');
    console.log(currentUser);
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
    <div className="flex row justify-center items-center flex-col m-0">
      <p>催し物管理システム</p>
      <h1>Pandora</h1>
      <button
        className={`flex items-center bg-blue-300 p-2 px-4 rounded shadow m-2 disabled:opacity-50 ${
          loginStatus === undefined && 'opacity-50'
        }`}
        onClick={() => login()}
        disabled={currentUser === undefined}
      >
        {currentUser === undefined && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#000000"
            className="animate-spin h-5 text-gray-900 mx-1"
          >
            <rect fill="none" height="24" width="24" />
            <path d="M2.88,7.88l1.54,1.54C4.15,10.23,4,11.1,4,12c0,4.41,3.59,8,8,8s8-3.59,8-8s-3.59-8-8-8c-0.9,0-1.77,0.15-2.58,0.42 L7.89,2.89C9.15,2.32,10.54,2,12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12C2,10.53,2.32,9.14,2.88,7.88z M7,5.5 C7,6.33,6.33,7,5.5,7S4,6.33,4,5.5S4.67,4,5.5,4S7,4.67,7,5.5z" />
          </svg>
        )}
        ログイン
      </button>
      <p></p>
    </div>
  );
}
