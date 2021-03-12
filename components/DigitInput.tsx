import 'react';
import { useEffect, useRef, useState } from 'react';

function DigitInput(props: {
  focus?: boolean;
  onKeyUp: Function;
  key: number;
  id: number;
}) {
  // ひとつひとつの入力欄
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // focusの値が変更されたときに
    if (!!props.focus && !!ref) {
      // 入力欄が自分のフォーカスされるべきであれば自動的に自分をフォーカスする
      ref.current.focus();
    }
  }, [props.focus]);
  function keyUp(e) {
    if (ref.current.value.length > 1) {
      ref.current.value = ref.current.value.slice(1);
      props.onKeyUp(props.id, e.key);
    }
    if (
      // 入力されたキーが数字若しくは文字だった場合フォーカス先を変更
      (e.keyCode <= 57 && e.keyCode >= 48) ||
      (e.keyCode >= 65 && e.keyCode <= 90) ||
      e.key == 9
    ) {
      props.onKeyUp(props.id, e.key);
    } else if (!(e.keyCode >= 16 && e.keyCode <= 20)) {
      // そうでない場合は入力された桁を空白に変更
      ref.current.value = '';
    }
  }
  return (
    <input
      type="text"
      max={9}
      min={0}
      required={true}
      onKeyUp={(e) => keyUp(e)}
      className="bg-gray-100 py-5 text-lg w-10 h-10 px-0 my-0.5 md:mx-2 text-center border-2 rounded focus:ring-2 focus:ring-offset-2"
      ref={ref}
      size={1}
      key={props.key}
      onFocus={() => (ref.current.value = '')}
    />
  );
}

// 入力欄のグループ
function Inputs(props: {
  elementsIds: number[];
  focusedElement: number;
  elementFocus: Function;
  digit: string[];
}): JSX.Element {
  const elements = [];
  for (let index = 0; index < props.elementsIds.length; index++) {
    elements.push(
      <DigitInput
        focus={props.focusedElement == index}
        onKeyUp={props.elementFocus}
        key={index}
        id={index}
      />
    );
  }
  return <>{elements}</>;
}

let digit: string[] = [];
export default function DigitInputs(props: { setDigit?: Function }) {
  // 現在フォーカスされている桁
  const [focusedElement, setFocusedElement] = useState<number>(0);
  const elementsIds: number[] = [0, 1, 2, 3, 4, 5];
  function elementFocus(id: number, inputKey: string) {
    digit[id] = inputKey;
    // フォーカスが当たる桁を移動
    if (Math.max(...elementsIds) > id) {
      setFocusedElement(id + 1);
    } else {
      // 最後の桁に到達した場合はsetDigitをdigitを引数にして実行
      props.setDigit(digit);
    }
  }
  return (
    <>
      <div className="flex w-full max-w-full justify-around">
        <Inputs
          elementsIds={elementsIds}
          focusedElement={focusedElement}
          elementFocus={elementFocus}
          digit={digit}
        />
      </div>
    </>
  );
}
