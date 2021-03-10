import { DocumentReference } from '@firebase/firestore-types';
import { FC, createContext, useEffect, useState } from 'react';

import firebase, { app } from '../utils/firebase';

type userData = {
  name: string;
  timestamp: Date;
};

type AuthContextProps = {
  currentUser: firebase.User | null | undefined;
  db: firebase.firestore.Firestore | null | undefined;
  userData: DocumentReference | undefined;
};

const AuthContext = createContext<AuthContextProps>({
  currentUser: undefined,
  db: undefined,
  userData: undefined,
});

const AuthProvider: FC = ({ children }) => {
  const db = firebase.firestore(app);
  const [currentUser, setCurrentUser] = useState<
    firebase.User | null | undefined
  >(undefined);
  const [userData, setUserData] = useState<
    DocumentReference | null | undefined
  >(undefined);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      async function setDb() {
        const data = await db.collection('users').doc(user.uid);
        setUserData(data);
      }
      if (!!user) {
        try {
          setDb();
        } catch (error) {
          console.error(error);
        }
        if (!!userData && !!user) {
          userData.set({
            name: user.displayName,
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
          });
        }
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser: currentUser, db: db, userData: userData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
