import { FC, createContext, useEffect, useState } from 'react';

import firebase from './../utils/firebase';

type AuthContextProps = {
  currentUser: firebase.User | null | undefined;
  db: firebase.firestore.Firestore | null | undefined;
};

const AuthContext = createContext<AuthContextProps>({
  currentUser: undefined,
  db: undefined,
});

const AuthProvider: FC = ({ children }) => {
  const db = firebase.firestore();
  const [currentUser, setCurrentUser] = useState<
    firebase.User | null | undefined
  >(undefined);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser: currentUser, db: db }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
