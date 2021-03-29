import { DocumentData, FirebaseFirestore } from '@firebase/firestore-types';
import React, {
  RefObject,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { AuthContext } from '../contexts/Auth';
import Action_button from './ActionButton';
import ActionButtonWhite from './ActionButtonWhite';
import ContentsUpload from './ContentsUpload';
import Modal from './Modal';

// イベント名
const EventTitle = React.memo(
  (props: {
    value: string;
    editable: boolean;
    edit: Function;
    onInput: Function;
  }) => {
    const ref = useRef<HTMLInputElement>();
    return (
      <>
        <label htmlFor="eventTitle" className="text-xs text-gray-500">
          イベント名
          {props.editable && (
            <span
              className={
                ref.current.value.length > 20 || ref.current.value.length < 1
                  ? 'text-red-400'
                  : undefined
              }
            >
              （{ref.current.value.length}/20）
            </span>
          )}
        </label>
        <div className="relative">
          <input
            type="text"
            id="eventTitle"
            value={props.value}
            maxLength={20}
            className="p-0.5 bg-transparent border-b-2 w-full"
            disabled={!props.editable}
            ref={ref}
            onInput={() => {
              props.onInput(ref.current.value);
            }}
            required
          />
          {!props.editable && (
            <button
              className="absolute right-0 bottom-0 w-7 h-7 p-1 text-gray-500"
              onClick={(e) => {
                e.preventDefault();
                props.edit(ref);
              }}
              aria-label="企画名を編集"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>鉛筆のアイコン</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          )}
        </div>
      </>
    );
  }
);

// イベント説明
const EventDescription = React.memo(
  (props: {
    value: string;
    editable: boolean;
    edit: Function;
    onInput: Function;
  }) => {
    const ref = useRef<HTMLTextAreaElement>();
    return (
      <>
        <label htmlFor="eventDescription" className="text-xs text-gray-500">
          説明
          {props.editable && !!props.value?.length && (
            <span className={ref.current.value.length > 150 && 'text-red-400'}>
              （{ref.current.value.length}/150）
            </span>
          )}
        </label>
        <div className="relative">
          <textarea
            cols={30}
            rows={5}
            id="eventDescription"
            value={props.value}
            maxLength={150}
            className="p-0.5 md:p-1 bg-transparent border-2 w-full"
            disabled={!props.editable}
            ref={ref}
            onInput={() => props.onInput(ref.current.value)}
          ></textarea>
          {!props.editable && (
            <button
              className="absolute right-1 bottom-2 w-7 h-7 p-1 text-gray-500"
              onClick={(e) => {
                e.preventDefault();
                props.edit(ref);
              }}
              aria-label="企画の説明を編集"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>鉛筆のアイコン</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          )}
        </div>
      </>
    );
  }
);

// 型
interface EventInfo {
  name: string;
  description?: string;
  image?: string;
}

// tempEventの更新用
const eventReducer = (
  state: EventInfo,
  data: {
    type?: 'update' | 'set';
    data?: EventInfo;
    label?: 'title' | 'description' | 'image';
    value?: string;
  }
) => {
  if (data.type == 'set') {
    const dataTemp: EventInfo = { ...data.data };
    if (!dataTemp?.description) {
      dataTemp.description = '';
    }
    return dataTemp;
  } else {
    const stateTemp: EventInfo = { ...state };
    switch (data.label) {
      case 'title':
        stateTemp.name = data.value;
        return stateTemp;

      case 'description':
        stateTemp.description = data.value;
        return stateTemp;

      default:
        break;
    }
  }
};

const EventImage = React.memo(
  (props: { value?: string; onChange: Function; edit: Function }) => {
    const [modalState, setModalState] = useState<boolean>(false);
    return (
      <>
        <Modal display={modalState} onClose={() => setModalState(false)}>
          <ContentsUpload />
        </Modal>
        <div className="w-44 h-44 md:w-48 md:h-48 bg-gray-50 rounded-full shadow-inner relative md:m-5 ">
          {!!props?.value ? (
            <img
              src={props?.value}
              className="w-full h-full absolute top-0 left-0"
            />
          ) : (
            <figure>
              <figcaption className="sr-only">
                企画の画像が未設定です
              </figcaption>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="absolute top-0 left-0 w-full h-full text-gray-200 p-8 md:p-10"
              >
                <title>写真のアイコン</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </figure>
          )}
          {/* 変更ボタン */}
          <button
            className="bg-gray-50 border text-gray-600 border-gray-200 absolute bottom-1 right-1 md:bottom-2 md:right-2 w-9 h-9 p-1.5 rounded-full hover:bg-gray-100 transition"
            onClick={(e) => {
              e.preventDefault();
              setModalState(true);
              props.edit();
            }}
            aria-label="画像を変更"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>鉛筆のアイコン</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </div>
      </>
    );
  }
);

// イベント情報
export function EventInfo(props: { userData: DocumentData }) {
  const context = useContext(AuthContext);
  const db: FirebaseFirestore = context.data;
  const [currentEvent, setCurrentEvent] = useState<EventInfo>();
  const [editable, setEditable] = useState<boolean>(false);

  const initEvent: EventInfo = {
    name: 'Loading',
  };

  const [tempEvent, dispatchTempEvent] = useReducer(eventReducer, initEvent);

  // 編集開始
  function edit(focusRef?: RefObject<HTMLInputElement | HTMLTextAreaElement>) {
    setEditable(true);
    if (!!focusRef) {
      focusRef.current.focus();
    }
  }

  useMemo(() => {
    if (!!db && !!props.userData) {
      db.collection('event')
        .doc(props.userData.joinedEvent)
        .get()
        .then((event) => {
          dispatchTempEvent({ type: 'set', data: event.data() as EventInfo });
          setCurrentEvent(event.data() as EventInfo);
        })
        .catch((error) => console.error(error));
    } else {
      console.error(props);
    }
  }, [!props.userData]);

  return (
    <form className=" p-5 flex flex-col items-center justify-center z-0 border-b-4 border-gray-100">
      <h2 className="sr-only">イベント情報</h2>
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl">
        <EventImage
          value={tempEvent?.image}
          onChange={() => console.info('hi')}
          edit={() => setEditable(true)}
        />
        {/* イベント情報 */}
        <div className="md:px-10 py-5 flex-1 md:max-w-xl">
          <div className="mb-2">
            <EventTitle
              value={tempEvent?.name}
              editable={editable}
              edit={edit}
              onInput={(e: string) =>
                dispatchTempEvent({
                  label: 'title',
                  value: e,
                })
              }
            />
          </div>
          <div>
            <EventDescription
              value={tempEvent?.description}
              editable={editable}
              edit={edit}
              onInput={(e: string) => {
                dispatchTempEvent({
                  label: 'description',
                  value: e,
                });
              }}
            />
          </div>
        </div>
      </div>
      {editable && (
        <div className="sm:flex w-full justify-end max-w-3xl px-4">
          <Action_button>変更を申請</Action_button>
          <ActionButtonWhite
            enabled={editable}
            action={(e: React.MouseEvent) => {
              e.preventDefault();
              setEditable(false);
              dispatchTempEvent({ type: 'set', data: currentEvent });
            }}
          >
            キャンセル
          </ActionButtonWhite>
        </div>
      )}
    </form>
  );
}
