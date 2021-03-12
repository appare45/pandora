import { WrapperProvider } from './../contexts/Wrapper';
import DigitInput from './../components/DigitInput';
import ActionCard from './../components/ActionCard';
import ActionButton from '../components/ActionButton';

import { useState } from 'react';
import { AuthContext } from '../contexts/Auth';
import { FirebaseFirestore } from '@firebase/firestore-types';
import WarningCard from '../components/WarningCard';

function JoinEvent() {
  const [digit, setDigit] = useState<string[]>();
  const [submitState, setSubmitState] = useState<'loading' | boolean>(false);
  const [submitError, setSubmitError] = useState<undefined | boolean>(true);
  function Completed(digit: string[]) {
    setDigit([...digit]);
    if (digit.length === 6) {
      setSubmitState(true);
    }
  }
  async function JoinEventMethod(data) {
    setSubmitState('loading');
    const db: FirebaseFirestore = data.data;
    await db
      .collection('event')
      .where('joinId', '==', digit.join(''))
      .get()
      .then((snapShot) => {
        if (snapShot.docs.length > 0) {
          setSubmitError(true);
          snapShot.forEach((doc) => {
            console.info(doc.data());
          });
        } else {
          setSubmitError(false);
        }
      });
    setSubmitState(true);
  }
  return (
    <div className="w-full">
      <ActionCard>
        <div className="mb-2 text-center md:text-left">
          <h3 className="text-xl font-bold">催し物に参加する</h3>
          <p>催し物コードを入力してください</p>
        </div>
        <div className="w-full md:w-auto md:flex-row flex flex-col">
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
        {!submitError && (
          <WarningCard
            title="催し物が見つかりませんでした"
            description="催し物コードを確認してください"
          />
        )}
      </ActionCard>
    </div>
  );
}

export default function Playground() {
  return (
    <>
      <WrapperProvider>
        <h1>Playground</h1>
        <JoinEvent />
      </WrapperProvider>
    </>
  );
}
