import { useEffect, useRef } from 'react';

export default function Modal(props: {
  children: JSX.Element;
  display: boolean;
  onClose?: Function;
  blockClose?: boolean;
}) {
  const modalRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (props.display) {
      modalRef.current.focus();
    }
  });
  return (
    <>
      {props.display && (
        <div
          className="w-full h-full flex-col flex justify-center items-center p-5 pt-16 md:p-16 fixed top-0 left-0 z-30"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && !props?.blockClose) {
              props.onClose();
            }
          }}
          ref={modalRef}
          role="dialog"
        >
          <div
            className={`w-full h-full ${
              !props?.blockClose ? 'cursor-pointer' : undefined
            } absolute top-0 left-0 bg-gray-50 ${
              !props?.blockClose ? 'opacity-90' : ''
            }`}
            onClick={() => {
              if (!props?.blockClose) {
                props.onClose();
              }
            }}
          ></div>
          <div className="z-10 m-5 max-h-full max-w-full overflow-y-scroll">
            {props.children}
          </div>
          {!props?.blockClose && (
            <button
              className="p-2 text-red-400 flex justify-center items-center z-10 transition duration-300 hover:bg-pink-50 rounded "
              onClick={() => {
                if (!props?.blockClose) {
                  props.onClose();
                }
              }}
              aria-label="モーダルを閉じる"
            >
              <figure className="w-5 h-5 mr-1 mt-0.5">
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </figure>
              <p>閉じる</p>
            </button>
          )}
        </div>
      )}
    </>
  );
}
