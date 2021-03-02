import { useContext, useEffect, useState } from 'react';
import firebase from '../utils/firebase';
import router from 'next/router';
import { AuthContext } from '../context/Auth';

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
    <>
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
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="animate-spin h-5 text-gray-900 mx-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        )}
        {currentUser === null ? "ログイン" : "ログイン中"}
      </button>
      {!!currentUser
        ? `ログイン中のユーザー：${currentUser.displayName}`
        : 'ログインしていない'}
      <p></p>
    </>
  );
}
