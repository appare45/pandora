import DigitInput from './DigitInput';
import ActionCard from './ActionCard';
import ActionButton from './ActionButton';
import { useState } from 'react';
import { AuthContext } from '../contexts/Auth';
import { FirebaseFirestore } from '@firebase/firestore-types';
import WarningCard from './WarningCard';
import firebase from './../utils/firebase';

export default function JoinEvent() {
  const [digit, setDigit] = useState<string[]>();
  const [submitState, setSubmitState] = useState<'loading' | boolean>(false);
  const [submitError, setSubmitError] = useState<{
    status: boolean;
    title?: string;
    description?: string;
  }>({ status: false });
  function Completed(digit: string[]) {
    setDigit([...digit]);
    if (digit.join('').length === 6) {
      setSubmitState(true);
    } else {
      setSubmitState(false);
    }
  }
  async function JoinEventMethod(data) {
    setSubmitState('loading');
    const db: FirebaseFirestore = data.data;
    const user: firebase.User = data.currentUser;
    if (digit.join('').length == 6) {
      try {
        await db
          .collection('event')
          .where('joinId', '==', digit.join(''))
          .get()
          .then((snapShot) => {
            if (snapShot.docs.length > 0) {
              setSubmitError({ status: false });
              snapShot.forEach((doc) => {
                db.collection('users')
                  .doc(user.uid)
                  .update({ joinedEvent: doc.id })
                  .catch((error) =>
                    setSubmitError({
                      status: true,
                      title: '催し物に参加できませんでした',
                      description: error.toString(),
                    })
                  );
              });
            } else {
              setSubmitError({
                status: true,
                title: '催し物が見つかりませんでした',
                description: '催し物コードを確認してください',
              });
            }
          })
          .catch((error) =>
            setSubmitError({
              status: true,
              title: '催し物検索中にエラーが発生しました',
              description: error,
            })
          );
      } catch {
        (error) =>
          setSubmitError({
            status: true,
            title: 'エラーが発生しました',
            description: error,
          });
      }
    } else {
      setSubmitError({
        status: true,
        title: '催し物コードが違います',
        description: '催し物コードは6桁の英数字です',
      });
    }
    setSubmitState(true);
  }
  return (
    <div className="w-full">
      <ActionCard>
        <div className="mb-2 text-center md:text-left flex flex-col justify-center">
          <h3 className="text-xl font-bold">催し物に参加する</h3>
          <p>催し物コードを入力してください</p>
        </div>
        <div>
          <div className="w-full md:w-auto md:flex-row flex flex-col md:items-center">
            <DigitInput setDigit={Completed} />
            <AuthContext.Consumer>
              {(data) => (
                <ActionButton
                  action={() => JoinEventMethod(data)}
                  enabled={submitState}
                >
                  参加
                </ActionButton>
              )}
            </AuthContext.Consumer>
          </div>
          {submitError.status && (
            <WarningCard
              title={submitError.title}
              description={submitError.description}
            />
          )}
        </div>
      </ActionCard>
    </div>
  );
}
