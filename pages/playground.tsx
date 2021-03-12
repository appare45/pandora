import Add_event_form from '../components/Add_event_form';
import { WrapperProvider } from './../contexts/Wrapper';
import DigitInput from './../components/DigitInput';
import { useEffect, useState } from 'react';

export default function Playground() {
  const [digit, setDigit] = useState<string[]>();
  function test(digit: string[]) {
    setDigit([...digit]);
  }
  return (
    <>
      <WrapperProvider>
        <h1>Playground</h1>
        <DigitInput setDigit={test} />
        <p>入力された値{digit}</p>
      </WrapperProvider>
    </>
  );
}
