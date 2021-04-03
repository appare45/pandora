import React from 'react';

const Action_button = (props: {
  children: Object;
  action?: Function;
  enabled?: boolean | 'loading';
  type?: 'submit' | 'reset' | 'button';

  color?: string;
}) => {
  const color: string = !props?.color ? 'blue' : props.color;
  return (
    <button
      className={`flex w-full md:w-auto items-center justify-center bg-${color}-100 md:bg-${color}-50 border border-${color}-300 md:border-${color}-300 text-${color}-500 hover:bg-${color}-100 transition-all h-9 md:h-8 px-3 text-sm rounded-md  whitespace-nowrap ${
        !props.enabled && 'opacity-50 cursor-not-allowed'
      } ${props.enabled == 'loading' && 'animate-pulse cursor-wait'}
      `}
      onClick={(e) => props.action(e)}
      disabled={!props.enabled}
      aria-label={`${props.children}を行う`}
      type={props?.type}
    >
      {props.children}
    </button>
  );
};

export default React.memo(Action_button);
