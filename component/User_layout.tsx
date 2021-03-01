import firebase from '../utils/firebase';
import router from 'next/router';
import { AuthContext } from './../context/Auth';
import { useContext, useEffect } from 'react';

export default function User_layout({ children }) {
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    !currentUser && router.push('/login');
  }, [currentUser]);

  const logout = () => {
    if (!!currentUser) firebase.auth().signOut();
  };
  return (
    <>
      <header className="w-full shadow flex items-center justify-between p-5 py-1">
        <h1 className="text-xl p-5 font-bold">Pandora System</h1>
        {!!currentUser && (
          <div className="items-center hidden sm:flex">
            <figure className="h-9 w-9 mx-3">
              <img
                src={currentUser.photoURL}
                alt=""
                className="h-full w-full rounded-full"
              />
            </figure>
            <div>
              <p>{!!currentUser && currentUser.displayName}</p>
              <button onClick={() => logout()}>ログアウト</button>
            </div>
          </div>
        )}
      </header>
      <main>{children}</main>
    </>
  );
}
