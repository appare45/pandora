import ContentsUpload from '../components/ContentsUpload';
import Editor from '../components/Editor';
import { WrapperProvider } from './../contexts/Wrapper';

export default function Playground() {
  return (
    <>
      <WrapperProvider>
        <Editor />
      </WrapperProvider>
    </>
  );
}
