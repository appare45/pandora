import React from 'react';

const Action_button_white = (props: {
  children: Object;
  action?: Function;
  enabled?: boolean | 'loading';
}) => {
  return (
    <button
      className={`flex w-full md:w-auto items-center justify-center bg-gray-100 border border-gray-300 md:border-gray-400 h-10 px-3 text-sm rounded-md m-1  whitespace-nowrap ${
        !props.enabled && 'opacity-50 cursor-not-allowed'
      } ${props.enabled == 'loading' && 'opacity-50 cursor-wait'}
      `}
      onClick={(e: React.MouseEvent) => props.action(e)}
      disabled={!props.enabled}
    >
      {props.enabled == 'loading' && (
        <img src="./loading.svg" className="mx-1 animate-spin" />
      )}
      {props.children}
    </button>
  );
};

export default React.memo(Action_button_white);
