export default function TrueFalseSelect(props: {
  onChange: Function;
  selected: boolean | null;
  trueString: string;
  falseString: string;
}) {
  return (
    <div className="flex justify-between m-1 my-2 text-sm">
      <button
        className={`flex-1 p-2 mx-1 rounded ${
          props.selected === false ? 'bg-gray-200' : 'bg-green-200'
        } whitespace-nowrap px-3`}
        onClick={() => props.onChange(true)}
      >
        {props.trueString}
      </button>
      <button
        className={`flex-1 p-2 px-3 mx-1 rounded whitespace-nowrap ${
          props.selected === true ? 'bg-gray-200' : 'bg-pink-200'
        }`}
        onClick={() => props.onChange(false)}
      >
        {props.falseString}
      </button>
    </div>
  );
}
