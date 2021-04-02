import React from 'react';

const Action_button = (props: {
  children: Object;
  action?: Function;
  enabled?: boolean | 'loading';
}) => {
  return (
    <button
      className={`flex w-full items-center justify-center bg-blue-200 text-blue-700 h-10 md:h-9 text-sm rounded-md  whitespace-nowrap ${
        !props.enabled && 'opacity-50 cursor-not-allowed'
      } ${props.enabled == 'loading' && 'opacity-50 cursor-wait'}
      `}
      onClick={(e) => props.action(e)}
      disabled={!props.enabled}
      aria-label={`${props.children}を行う`}
    >
      {props.enabled == 'loading' && (
        <img src="./loading.svg" className="mx-1 animate-spin" />
      )}
      {props.children}
    </button>
  );
};

export default React.memo(Action_button);
