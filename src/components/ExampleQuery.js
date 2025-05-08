export default function ExampleQuery({text}) {
  return (
    <div className="mt-4 ">
      <p className="inline-block text-sm bg-white/30 text-white transition hover:bg-white/40 px-4 py-1 rounded-full">
        {text}
      </p>
    </div>
  );
}
