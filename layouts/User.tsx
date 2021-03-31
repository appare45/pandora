import { AuthContext } from '../contexts/Auth';
import React, { useContext, useReducer, useState } from 'react';
import LoginFront from '../components/login';
import Head from 'next/head';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import { OrgData } from '../entities/Organization';

export default function User_layout({ children }) {
  const { currentUser, firestore } = useContext(AuthContext);
  const Header = React.memo(() => {
    const [currentOrg, setCurrentOrg] = useState<OrgData>();
    const [userMenuStatus, setUserMenuStatus] = useState(false);

    // firestore
    //   .collection(currentUser.uid)
    //   .doc('user')
    //   .get()
    //   .then((data) => {
    //     firestore.doc('organization').collection(data.data().organization);
    //   });

    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
          <title>{!currentUser ? 'ログイン' : 'Pandora'}</title>
        </Head>
        <header className="w-full shadow flex items-center justify-between p-5 py-1 relative z-50">
          <h1 className="text-2xl py-3 font-bold">
            <Link href="/">
              <a>🐍Pandora</a>
            </Link>
          </h1>
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </header>
        <Modal
          display={userMenuStatus}
          onClose={() => setUserMenuStatus(false)}
        >
          <Sidebar currentUser={currentUser} currentOrg={currentOrg} />
        </Modal>
      </>
    );
  });
  // メモ化されたヘッダー

  return (
    <>
      {currentUser === null ? (
        <LoginFront />
      ) : (
        <>
          <Header />
          <main className="grid grid-cols-1 md:grid-cols-5 h-screen relative">
            <div className="hidden md:block justify-items-start col-start-1 relative bg-gray-50">
              <div className="sticky top-0 h-screen">
                <Sidebar currentUser={currentUser} />
              </div>
            </div>
            <div className="md:col-start-2 md:col-end-6 max-w-full">
              {' '}
              {children}
            </div>
          </main>
        </>
      )}
    </>
  );
}
