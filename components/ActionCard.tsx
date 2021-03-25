export default function ActionCard(props: { children: Object }) {
  return (
    <div className="bg-blue-100 px-4 py-6 m-3 rounded-lg md:flex justify-center md:justify-around max-w-5xl">
      {props.children}
    </div>
  );
}
