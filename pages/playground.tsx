import { WrapperProvider } from './../contexts/Wrapper';
import DigitInput from './../components/DigitInput';
import ActionCard from './../components/ActionCard';
import ActionButton from '../components/ActionButton';

import { useState } from 'react';

function JoinEvent() {
  const [digit, setDigit] = useState<string[]>();
  function test(digit: string[]) {
    setDigit([...digit]);
  }
  return (
    <div className="w-full">
      <ActionCard>
        <div className="mb-2 text-center md:text-left">
          <h3 className="text-xl font-bold">催し物に参加する</h3>
          <p>催し物コードを入力してください</p>
        </div>
        <div className="w-full md:w-auto md:flex-row flex flex-col">
          <DigitInput setDigit={test} />
          <ActionButton action={() => console.log(digit)}>参加</ActionButton>
        </div>
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
