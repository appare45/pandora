export default function ActionCard(props: { children: Object }) {
  return (
    <div className="bg-blue-50 px-4 py-6 rounded-lg md:flex flex-col justify-center md:justify-around max-w-5xl overflow-x-scroll">
      {props.children}
    </div>
  );
}
