const Action_button = (props: { children: Object; action: Function }) => {
  return (
    <button
      className="flex items-center justify-center bg-blue-400 h-10 px-3 text-sm shadow-sm rounded-md m-1 whitespace-nowrap"
      onClick={(e) => props.action(e)}
    >
      {props.children}
    </button>
  );
};

export default Action_button;
