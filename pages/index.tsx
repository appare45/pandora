import React, { useMemo } from 'react';
import User_layout from './../layouts/User';
import { AuthContext } from '../contexts/Auth';
import '../components/ActionButton';
import firebase from './../utils/firebase';
import { DocumentData, FirebaseFirestore } from '@firebase/firestore-types';
import { useContext, useState } from 'react';
import { EventInfo } from '../components/EventInfo';
import { getUser } from '../repositories/User';
import { UserData } from '../entities/User';

export function AddEvent() {
  return (
    <form>
      <h2 className="text-xl font-semibold">催し物を追加</h2>
      催し物名 <input type="text" className="border my-5" />
      <button
        type="submit"
        className="block bg-blue-400 p-5 py-2 rounded font-semibold shadow-lg"
      >
        作成
      </button>
    </form>
  );
}

// 表示するメインの部分
const App = React.memo((props: { user: firebase.User }) => {
  const context = useContext(AuthContext);
  const db: FirebaseFirestore = context.firestore;
  const [userData, setUserData] = useState<null | UserData>(null);
  useMemo(() => {
    if (!!props.user?.uid) {
      // db.collection('user')
      //   .doc(props.user.uid)
      //   .onSnapshot(
      //     (doc) => {
      //       setUserData(doc.data());
      //     },
      //     (error) => {
      //       console.info(error);
      //     }
      //   );
      getUser(props.user.uid).then((user: UserData) => {
        setUserData(user);
      });
    }
  }, [!props.user?.uid]);

  return (
    <>
      {!!userData?.lastLogin && (
        <>
          <EventInfo userData={userData} />
        </>
      )}
    </>
  );
});

export default function Home() {
  const context = useContext(AuthContext);
  const [user, setUser] = useState<firebase.User>();
  useMemo(() => {
    setUser(context.currentUser);
  }, [context]);
  return (
    <User_layout>
      <App user={user} />
    </User_layout>
  );
}
