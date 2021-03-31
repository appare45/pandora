import { FC, createContext, useEffect, useState } from 'react';
import { setUser } from '../repositories/User';

import firebase, { app } from '../utils/firebase';

export type AuthContextProps = {
  currentUser: firebase.User | null | undefined;
  firestore: firebase.firestore.Firestore | null | undefined;
};

const AuthContext = createContext<AuthContextProps>({
  currentUser: undefined,
  firestore: undefined,
});

const AuthProvider: FC = ({ children }) => {
  const db = firebase.firestore(app);
  const [currentUser, setCurrentUser] = useState<
    firebase.User | null | undefined
  >(undefined);

  useEffect(() => {
    // ログイン状態が変更されたとき
    firebase.auth().onAuthStateChanged((user) => {
      // 現在のユーザーを設定
      setCurrentUser(user);
      // DBを更新
      if (!!user?.uid) {
        setUser(
          user.uid,
          {
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser: currentUser, firestore: db }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
