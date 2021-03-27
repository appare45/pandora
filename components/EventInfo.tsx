import { DocumentData, FirebaseFirestore } from '@firebase/firestore-types';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/Auth';
export const EventInfo = React.memo((props: { userData: DocumentData }) => {
  const context = useContext(AuthContext);
  const db: FirebaseFirestore = context.data;
  const [currentEvent, setCurrentEvent] = useState<Object | any>();
  useEffect(() => {
    console.info(props.userData);
    if (!!db && !!props.userData) {
      db.collection('event')
        .doc(props.userData.joinedEvent)
        .get()
        .then((event) => setCurrentEvent(event.data()))
        .catch((error) => console.error(error));
    } else {
      console.error(props.userData);
    }
  }, [props.userData]);
  return (
    <form className="bg-blue-50 p-5 flex flex-col md:flex-row items-center justify-center">
      {/* アイコン画像 */}
      <div className="w-44 h-44 md:w-48 md:h-48 bg-gray-50 rounded-full shadow-inner relative md:m-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="absolute top-0 left-0 w-full h-full text-gray-200 p-4 md:p-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {!!currentEvent?.image && (
          <img
            src={currentEvent?.image}
            className="w-full h-full absolute top-0 left-0"
          />
        )}
        {/* 変更ボタン */}
        <button className="bg-gray-50 border text-gray-600 border-gray-200 absolute bottom-1 right-1 md:bottom-2 md:right-2 w-9 h-9 p-1.5 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      </div>
      {/* イベント情報 */}
      <div className="md:px-10 py-5 flex-1 md:max-w-xl">
        <div className="mb-2">
          <label htmlFor="eventTitle" className="text-xs text-gray-500">
            イベント名
          </label>
          <div className="relative">
            <input
              type="text"
              id="eventTitle"
              value={currentEvent?.name}
              maxLength={20}
              className="p-0.5 bg-transparent border-b-2 w-full"
              disabled
            />
            <button className="absolute right-0 bottom-0 w-7 h-7 p-1 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="eventDescription" className="text-xs text-gray-500">
            説明
          </label>
          <div className="relative">
            <textarea
              cols={30}
              rows={5}
              id="eventDescription"
              value={currentEvent?.description}
              maxLength={150}
              className="p-0.5 md:p-1 bg-transparent border-2 w-full"
            ></textarea>
            <button className="absolute right-1 bottom-2 w-7 h-7 p-1 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
});
