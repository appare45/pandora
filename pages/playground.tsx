import { WrapperProvider } from './../contexts/Wrapper';

export default function Playground() {
  return (
    <>
      <WrapperProvider>
        <h1>Playground</h1>
      </WrapperProvider>
    </>
  );
}
