import React from 'react';
import User_layout from '../components/User_layout';
import { AuthContext } from '../contexts/Auth';
import '../components/ActionButton';
import JoinEvent from '../components/JoinEvent';
import firebase from './../utils/firebase';
import { DocumentSnapshot, FirebaseFirestore } from '@firebase/firestore-types';
import { useContext, useEffect, useState } from 'react';

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

const EventInfo = React.memo((props: { user: firebase.User }) => {
  const context = useContext(AuthContext);
  const db: FirebaseFirestore = context.data;
  const [currentEvent, setCurrentEvent] = useState<Object | any>();
  useEffect(() => {
    if (!!db && !!props.user) {
      db.collection('users')
        .doc(props.user?.uid)
        .get()
        .then((doc) => {
          db.collection('event')
            .doc(doc.data().joinedEvent)
            .get()
            .then((event) => setCurrentEvent(event.data()))
            .catch((error) => console.error(error));
        })
        .catch((error) => console.error(error));
    } else {
      console.error(props);
    }
  }, [props.user]);
  return <>イベント名：{currentEvent?.name}</>;
});

const App = React.memo((props: { user: firebase.User }) => {
  const context = useContext(AuthContext);
  const db: FirebaseFirestore = context.data;
  const [userData, setUserData] = useState<null | DocumentSnapshot>(null);
  if (!!props.user?.uid) {
    db.collection('users')
      .doc(props.user.uid)
      .onSnapshot((user) => setUserData(user));
  }
  return (
    <>
      {userData !== null &&
      userData.data()?.joinedEvent === undefined &&
      !!props.user ? (
        <JoinEvent />
      ) : (
        <EventInfo user={props.user} />
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
