import React from 'react';
import firebase from '../utils/firebase';
import router from 'next/router';
import { AuthContext } from '../context/Auth';
import { useContext, useEffect, useState } from 'react';

// const Children = React.memo((props: { children }) => {
//   return <main className="px-5">{props.children}</main>;
// });

export default function User_layout({ children }) {
  // メモ化されたヘッダー
  const Header = React.memo(() => {
    const { currentUser } = useContext(AuthContext);

    const [userMenuStatus, setUserMenuStatus] = useState(false);

    useEffect(() => {
      !currentUser && router.push('/login');
    }, [currentUser]);

    const logout = () => {
      if (!!currentUser) firebase.auth().signOut();
    };
    return (
      <header className="w-full shadow flex items-center justify-between p-5 py-1 relative">
        <h1 className="text-2xl py-3 font-bold">Pandora</h1>
        <button
          className="w-11 h-11 m-1 p-1 sm:hidden"
          onClick={() => setUserMenuStatus(!userMenuStatus)}
        >
          {userMenuStatus ? (
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
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
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
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </button>
        {!!currentUser && (
          <div
            className={`items-center ${
              userMenuStatus ? 'flex' : 'hidden'
            } sm:flex absolute sm:static top-16 left-0 bg-gray-100 sm:bg-transparent w-full sm:w-auto p-3 sm:p-1`}
          >
            <figure className="h-9 w-9 mx-3">
              <img
                src={currentUser.photoURL}
                alt=""
                className="h-full w-full rounded-full"
              />
            </figure>
            <div className="mx-1">
              <p>{!!currentUser && currentUser.displayName}</p>
              <button onClick={() => logout()}>ログアウト</button>
            </div>
          </div>
        )}
      </header>
    );
  });

  return (
    <>
      <Header />
      <main className="px-5">{children}</main>
    </>
  );
}
