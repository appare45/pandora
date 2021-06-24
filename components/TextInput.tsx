import { useRef } from 'react';

export default function TextInput(props: {
  editable: boolean;
  value: string;
  edit?: Function;
  onInput: Function;
  label?: string;
  max?: number;
  min?: number;
}) {
  const ref = useRef<HTMLInputElement>();
  const id: string = `textInput-${Math.random().toString()}`;
  return (
    <div className="w-full">
      {!!props?.label && (
        <label htmlFor={id} className="text-xs text-gray-500">
          {props.label}
          {props.editable &&
            (!!props?.max || !!props?.min) &&
            ref.current?.value !== undefined && (
              <span
                className={
                  (!!props?.max && ref.current?.value.length > props?.max) ||
                  (!!props?.min && ref.current?.value.length < props?.min)
                    ? 'text-red-400'
                    : undefined
                }
              >
                （{ref.current?.value.length}/{props?.max}）
              </span>
            )}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          id={id}
          value={props.value}
          maxLength={props?.max}
          minLength={props?.min}
          className="w-full bg-white"
          disabled={!props.editable}
          ref={ref}
          onChange={() => {
            props.onInput(ref.current.value);
          }}
          required
        />
        {!props.editable && (
          <button
            className="absolute right-0 bottom-0 h-full w-10 p-2 text-gray-500"
            onClick={(e) => {
              e.preventDefault();
              props?.edit(ref);
              ref.current.focus();
            }}
            aria-label={`${props.label}を編集`}
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
    </div>
  );
}
