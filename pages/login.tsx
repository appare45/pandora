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
  >(undefined);

  return (
    <>
      <button
        className={`bg-blue-300 p-2 rounded shadow m-2 disabled:opacity-50 ${loginStatus==undefined && "bg-red-100"}`}
        onClick={() => login()}
        disabled={currentUser === undefined}
      >
        ログイン
      </button>
      {!!currentUser
        ? `ログイン中のユーザー：${currentUser.displayName}`
        : 'ログインしていない'}
      <p></p>
    </>
  );
}
