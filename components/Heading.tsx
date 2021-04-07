export default function Heading(props: { level: number; children }) {
  switch (props.level) {
    case 1:
      return <h1 className="text-2xl font-medium">{props.children}</h1>;

    case 2:
      return (
        <h2 className="text-lg font-medium break-normal flex-1 w-full whitespace-nowrap">
          {props.children}
        </h2>
      );

    default:
      break;
  }
}
