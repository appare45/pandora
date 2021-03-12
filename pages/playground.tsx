import Editor from '../components/Editor';
import { WrapperProvider } from './../contexts/Wrapper';

export default function Playground() {
  return (
    <>
      <WrapperProvider>
        <Editor />
        <h1>Playground</h1>
      </WrapperProvider>
    </>
  );
}
