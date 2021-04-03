import 'react';
export default function WarningCard(props: { error: Error }) {
  return (
    <div className="bg-yellow-50 rounded-lg px-4 py-2 flex items-center mt-2 opacity-80 border border-yellow-400">
      <div className="flex-0 mr-2 md:mr-5 pt-0.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="text-yellow-400 w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div className="flex-1">
        <p className="opacity-70 text-sm md:leading-5">{props.error.name}</p>
        <p className="text-xs opacity-70 break-normal md:leading-4">
          {props.error.message}
        </p>
      </div>
    </div>
  );
}
