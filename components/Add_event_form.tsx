import React, { FormEvent, useState } from 'react';
import Action_button from './Action_button';
import Wrapper from './Wrapper';

const Event_select = React.memo(() => {
  const [eventType, setEventType] = useState<
    'general' | 'print' | 'performance'
  >('general');
  return (
    <ul className="flex flex-1">
      <li
        className={`mx-1 py-0.5 px-2 rounded bg-gray-100 cursor-pointer ${
          eventType == 'general' && 'ring-2 bg-green-200'
        }`}
        onClick={() => setEventType('general')}
        tabIndex={1}
      >
        一般
      </li>
      <li
        className={`mx-1 py-0.5 px-2 rounded bg-gray-100 cursor-pointer ${
          eventType == 'performance' && 'ring-2 bg-yellow-200'
        }`}
        onClick={() => setEventType('performance')}
        tabIndex={1}
      >
        公演
      </li>
      <li
        className={`mx-1 py-0.5 px-2 rounded bg-gray-100 cursor-pointer ${
          eventType == 'print' && 'ring-2 bg-red-200'
        }`}
        onClick={() => setEventType('print')}
        tabIndex={1}
      >
        印刷
      </li>
    </ul>
  );
});

const EventNameInput = React.memo((props: { handleChange }) => {
  return (
    <input
      type="text"
      placeholder="催し物名"
      className="p-1 w-full"
      id="event_title"
      onChange={(e) => props.handleChange(e.target.value)}
    />
  );
});

export default function Add_event_form() {
  function addEvent(e: FormEvent) {
    e.preventDefault();
    console.table({
      name: eventName,
    });
  }

  const [eventName, setEventName] = useState<string>('');
  const [modalStatus, setmodalStatus] = useState<boolean>(true);

  function cancelFunc() {
    // キャンセルが行われたときにモーダルのステートを変更
    setmodalStatus(false);
  }

  return (
    modalStatus && (
      <Wrapper cancelFunction={cancelFunc}>
        <form className="bg-blue-100 rounded p-4 px-6 shadow-lg max-w-sm">
          <h3 className="text-lg mb-3 font-medium">催し物追加</h3>
          <EventNameInput handleChange={setEventName} />
          <div className="flex items-center  justify-center w-full h-8 my-3">
            <Event_select />
            <Action_button action={addEvent}>追加</Action_button>
          </div>
        </form>
      </Wrapper>
    )
  );
}
