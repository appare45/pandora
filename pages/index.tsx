import React from 'react';
import User_layout from '../components/User_layout';
import { AuthContext } from '../contexts/Auth';
import '../components/ActionButton';
import JoinEvent from '../components/JoinEvent';
import firebase from './../utils/firebase';
import { DocumentData, FirebaseFirestore } from '@firebase/firestore-types';
import { useContext, useEffect, useState } from 'react';
import ContentsUpload from '../components/ContentsUpload';
import { EventInfo } from '../components/EventInfo';

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
  const db: FirebaseFirestore = context.data;
  const [userData, setUserData] = useState<null | DocumentData>(null);
  if (!!props.user?.uid) {
    db.collection('users')
      .doc(props.user.uid)
      .onSnapshot(
        (doc) => {
          setUserData(doc.data());
        },
        (error) => {
          console.info(error);
        }
      );
  }
  return (
    <>
      {userData !== null &&
      userData?.joinedEvent === undefined &&
      !!props.user ? (
        <JoinEvent />
      ) : (
        <>
          <EventInfo userData={userData} />
          <ContentsUpload />
        </>
      )}
    </>
  );
});

export default function Home() {
  const context = useContext(AuthContext);
  const [user, setUser] = useState<firebase.User>();
  useEffect(() => setUser(context.currentUser), [context]);
  return (
    <User_layout>
      <App user={user} />
    </User_layout>
  );
}
