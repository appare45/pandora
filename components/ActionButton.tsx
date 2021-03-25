const Action_button = (props: {
  children: Object;
  action?: Function;
  enabled?: boolean | 'loading';
}) => {
  return (
    <button
      className={`flex w-full md:w-auto items-center justify-center bg-blue-400 h-10 px-3 text-sm shadow-sm rounded-md m-1  whitespace-nowrap ${
        !props.enabled && 'opacity-50 cursor-not-allowed'
      } ${props.enabled == 'loading' && 'opacity-50 cursor-wait'}
      `}
      onClick={(e) => props.action(e)}
      disabled={!props.enabled}
    >
      {props.enabled == 'loading' && (
        <img src="./loading.svg" className="mx-1 animate-spin" />
      )}
      {props.children}
    </button>
  );
};

export default Action_button;
