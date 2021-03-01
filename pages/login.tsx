import { useContext, useEffect } from 'react';
import firebase from '../utils/firebase';
import { AuthContext } from './context/Auth';

export default function LoginFront() {
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    console.log(currentUser)
  },[currentUser])

  const login = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  };

  const logout = () => {
    if(!!currentUser) {
      firebase.auth().signOut();
    }
  };
  return (
    <>
      <button
        className="bg-blue-300 p-2 rounded shadow m-2"
        onClick={() => login()}
      >
        ログイン
      </button>
      <button
        className="bg-blue-300 p-2 rounded shadow m-2"
        onClick={() => logout()}
      >
        ログアウト
      </button>
      {
        !!currentUser ? `ログイン中のユーザー：${currentUser.displayName}` : 'ログインしていない'
      }
      <p></p>
    </>
  );
}
