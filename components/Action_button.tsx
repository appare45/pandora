const Action_button = (props: { children: Object; action: Function }) => {
  return (
    <button
      className="flex h-full items-center justify-center bg-blue-400 p-2 px-3 text-sm shadow-sm rounded-md ml-10"
      onClick={(e) => props.action(e)}
    >
      {props.children}
    </button>
  );
};

export default Action_button;
