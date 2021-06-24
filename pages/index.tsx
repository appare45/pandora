import React, { useMemo } from 'react';
import User_layout from './../layouts/User';
import { AuthContext } from '../contexts/Auth';
import '../components/ActionButton';
import firebase from './../utils/firebase';
import { useContext, useState } from 'react';
import { getUser } from '../repositories/User';
import { UserData } from '../entities/User';
import Heading from '../components/Heading';
import { Section } from '../components/Section';
import ActionButton from '../components/ActionButton';
import ActionCard from '../components/ActionCard';
import TextInput from '../components/TextInput';

function CreateEvent() {
  const [name, setName] = useState<string>('');
  return (
    <ActionCard>
      <div className="flex w-full justify-around items-center">
        <div>
          <TextInput
            editable
            label="催し物名"
            min={1}
            max={20}
            value={name}
            onInput={(e: string) => setName(e)}
          />
          <select className="w-full">
            <option value="general">一般</option>
            <option value="print">印刷</option>
            <option value="performance">公演</option>
          </select>
        </div>
        <ActionButton>作成</ActionButton>
      </div>
    </ActionCard>
  );
}

function Events() {
  const [create, setCreate] = useState<boolean>();
  return (
    <Section>
      <div className="flex w-full justify-between">
        <Heading level={2}>催し物</Heading>
        {create ? (
          <ActionButton color="gray" enabled action={() => setCreate(false)}>
            キャンセル
          </ActionButton>
        ) : (
          <ActionButton enabled action={() => setCreate(true)}>
            作成
          </ActionButton>
        )}
      </div>
      {create && <CreateEvent />}
    </Section>
  );
}

// 表示するメインの部分
const App = React.memo((props: { user: firebase.User }) => {
  const [userData, setUserData] = useState<null | UserData>(null);
  useMemo(() => {
    if (!!props.user?.uid) {
      getUser(props.user.uid).then((user: UserData) => {
        setUserData(user);
      });
    }
  }, [!props.user?.uid]);

  return (
    <>
      <div className="max-w-4xl md:mx-4 mx-1">
        <Events />
      </div>
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
