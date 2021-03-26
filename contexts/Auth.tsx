import { FC, createContext, useEffect, useState } from 'react';

import firebase, { app } from '../utils/firebase';

export type AuthContextProps = {
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

  useEffect(() => {
    // ログイン状態が変更されたとき
    firebase.auth().onAuthStateChanged((user) => {
      // 現在のユーザーを設定
      setCurrentUser(user);
      // DBを更新
      async function setDb() {
        return await db.collection('users').doc(user.uid);
      }
      if (!!user) {
        try {
          setDb().then((data) => {
            if (!!data && !!user) {
              data.set(
                {
                  name: user.displayName,
                  lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                },
                { merge: true }
              );
            }
          });
        } catch (error) {
          console.error(error);
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
