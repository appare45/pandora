import React, { FormEvent, useState } from 'react';

function Event_select() {
  const [eventType, setEventType] = useState<
    'general' | 'print' | 'performance'
  >('general');
  return (
    <ul className="flex w-full justify-center">
      <li
        className={`mx-1 py-0.5 px-2 rounded bg-gray-100 ${
          eventType == 'general' && 'ring-2 bg-green-200'
        }`}
        onClick={() => setEventType('general')}
        tabIndex={1}
      >
        一般
      </li>
      <li
        className={`mx-1 py-0.5 px-2 rounded bg-gray-100 ${
          eventType == 'performance' && 'ring-2 bg-yellow-200'
        }`}
        onClick={() => setEventType('performance')}
        tabIndex={1}
      >
        公演
      </li>
      <li
        className={`mx-1 py-0.5 px-2 rounded bg-gray-100 ${
          eventType == 'print' && 'ring-2 bg-red-200'
        }`}
        onClick={() => setEventType('print')}
        tabIndex={1}
      >
        印刷
      </li>
    </ul>
  );
}

const EventNameInput = React.memo((props: { handleChange }) => {
  return (
    <input
      type="text"
      placeholder="催し物名"
      className="text-md p-1 flex-1"
      id="event_title"
      onChange={(e) => props.handleChange(e.target.value)}
    />
  );
});

export default function Add_event_form() {
  function addEvent(e: FormEvent) {
    e.preventDefault();
  }

  const [eventName, setEventName] = useState<string>('');

  return (
    <form className="bg-blue-100 mx-5 my-3 rounded p-5 shadow-lg">
      <h3 className="text-lg mb-2">催し物追加</h3>
      <Event_select />
      <div className="flex items-center  justify-center w-full h-8 my-3">
        <EventNameInput handleChange={setEventName} />
        <button
          className="flex h-full items-center bg-blue-400 p-2 px-3 mx-3 text-sm shadow-sm rounded-md"
          onClick={(e) => addEvent(e)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          追加
        </button>
      </div>
    </form>
  );
}
