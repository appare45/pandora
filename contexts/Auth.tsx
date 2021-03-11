import { DocumentReference } from '@firebase/firestore-types';
import { FC, createContext, useEffect, useState } from 'react';

import firebase, { app } from '../utils/firebase';

type AuthContextProps = {
  currentUser: firebase.User | null | undefined;
  data: firebase.firestore.Firestore | null | undefined;
};

const AuthContext = createContext<AuthContextProps>({
  currentUser: undefined,
  data: undefined,
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
    // ログイン状態が変更されたとき
    firebase.auth().onAuthStateChanged((user) => {
      // 現在のユーザーを設定
      setCurrentUser(user);
      // DBを更新
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
    <AuthContext.Provider value={{ currentUser: currentUser, data: db }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
