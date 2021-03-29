import { useState } from 'react';
import ContentsUpload from '../components/ContentsUpload';
import Editor from '../components/Editor';
import Modal from '../components/Modal';

export default function Playground() {
  const [modalState, setModalState] = useState<boolean>(true);
  return (
    <>
      <Editor />
      <Modal display={modalState} onClose={() => setModalState(false)}>
        <ContentsUpload />
      </Modal>
    </>
  );
}
