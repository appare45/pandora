import 'react';
import { useEffect, useRef, useState } from 'react';

function DigitInput(props: { focus?: boolean; onKeyUp: Function }) {
  // ひとつひとつの入力欄
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!!props.focus && !!ref) {
      // 入力欄が自分のフォーカスされるべきであれば自動的に自分をフォーカスする
      ref.current.focus();
      console.log(props.focus);
    }
  });
  return (
    <input
      type="text"
      max={9}
      min={0}
      required={true}
      onKeyUp={() => props.onKeyUp()}
      className="bg-gray-100 p-3 px-0 text-xl m-0.5 text-center border-2 rounded focus:ring-2 focus:ring-offset-2"
      ref={ref}
      size={1}
    />
  );
}

function Inputs(props: {
  elementsIds: number[];
  focusedElement: number;
  elementFocus: Function;
}): JSX.Element {
  const elements = [];
  for (let index = 0; index < props.elementsIds.length; index++) {
    elements.push(
      <DigitInput
        focus={props.focusedElement == index}
        onKeyUp={() => props.elementFocus(index)}
      />
    );
  }
  return <>{elements}</>;
}
export default function DigitInputs(props: { setDigit?: Function }) {
  // 現在入力済みのコード
  const [digit, setDigit] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  // 現在フォーカスされている桁
  const [focusedElement, setFocusedElement] = useState<number>(Math.min(...digit));
  const elementsIds: number[] = [0, 1, 2, 3, 4, 5, 6];
  function elementFocus(id) {
    console.log(id)
    // フォーカスが当たる桁を移動
    if (Math.max(...elementsIds) > id) {
      setFocusedElement(id + 1);
    }
  }
  return (
    <>
      <div className="flex w-100 justify-around">
        <Inputs
          elementsIds={elementsIds}
          focusedElement={focusedElement}
          elementFocus={elementFocus}
        />
      </div>
    </>
  );
}
