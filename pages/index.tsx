import User_layout from '../components/User_layout';
import { AuthContext } from '../contexts/Auth';
import '../components/ActionButton';
import JoinEvent from '../components/JoinEvent';
import firebase from './../utils/firebase';
import { FirebaseFirestore } from '@firebase/firestore-types';
import { useEffect, useState } from 'react';

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

function App(props: { data }) {
  const db: FirebaseFirestore = props.data.data;
  const user: firebase.User = props.data.currentUser;
  const [data, setData] = useState<any | undefined>();
  if (!!user && !!db) {
    db.collection('users')
      .doc(user.uid)
      .get()
      .then((doc) => setData(doc.data()));
  }
  useEffect(() => {}, [user]);
  return <>{data?.joinedEvent === undefined && !!user && <JoinEvent />}</>;
}

export default function Home() {
  return (
    <User_layout>
      <AuthContext.Consumer>
        {(data) => <App data={data} />}
      </AuthContext.Consumer>
      <p>hi!</p>
    </User_layout>
  );
}
