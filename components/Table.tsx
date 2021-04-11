export default function Table(props: { children }) {
  return (
    <div className="w-full overflow-x-scroll">
      <table className="table-auto w-full whitespace-nowrap overflow-x-scroll mt-4">
        {props.children}
      </table>
    </div>
  );
}
