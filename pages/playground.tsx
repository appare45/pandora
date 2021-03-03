import Add_event_form from '../components/Add_event_form';
import { WrapperProvider } from './../contexts/Wrapper';

export default function Playground() {
  return (
    <>
      <WrapperProvider>
        <h1>Playground</h1>
        <Add_event_form />
      </WrapperProvider>
    </>
  );
}
