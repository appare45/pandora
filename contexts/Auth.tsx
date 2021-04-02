import { FC, createContext, useEffect, useState } from 'react';
import { UserData } from '../entities/User';
import { getUser, setUser } from '../repositories/User';

import firebase, { app } from '../utils/firebase';

export type AuthContextProps = {
  currentUser: firebase.User | null | undefined;
  currentUserData: UserData;
  firestore: firebase.firestore.Firestore | null | undefined;
};

const AuthContext = createContext<AuthContextProps>({
  currentUser: undefined,
  firestore: undefined,
  currentUserData: undefined,
});

const AuthProvider: FC = ({ children }) => {
  const db = firebase.firestore(app);
  const [currentUser, setCurrentUser] = useState<
    firebase.User | null | undefined
  >(undefined);
  const [currentUserData, setCurrentUserData] = useState<UserData>(undefined);

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
        getUser(user.uid).then((userData) => {
          setCurrentUserData(userData);
        });
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser: currentUser,
        firestore: db,
        currentUserData: currentUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
