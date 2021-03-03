// 背景が白くなってモーダルが表示されるラッパー
// キャンセルボタン付き

const Wrapper = (props: { children: Object; cancelFunction: Function }) => {
  return (
    <div className="w-full h-full fixed inset-0 bg-gray-50 bg-opacity-90 flex justify-center items-end py-5">
      <div
        className="w-full h-full fixed inset-0 cursor-pointer"
        onClick={() => props.cancelFunction()}
      ></div>
      <div className="z-10 flex justify-center flex-col">
        {props.children}{' '}
        <button
          className="p-2 text-red-300 font-bold mt-2 text-sm flex justify-center items-center"
          onClick={() => props.cancelFunction()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-4 inline mx-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <p>キャンセル</p>
        </button>
      </div>
    </div>
  );
};

export default Wrapper;
