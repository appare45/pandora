import Add_event_form from '../components/Add_event_form';
import { WrapperProvider } from './../contexts/Wrapper';
import DigitInput from './../components/DigitInput';
import { useState } from 'react';

export default function Playground() {
  const [digit, setDigit] = useState<string>('')
  return (
    <>
      <WrapperProvider>
        <h1>Playground</h1>
        <DigitInput setDigit={setDigit}/>
      </WrapperProvider>
    </>
  );
}
