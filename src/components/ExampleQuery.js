
export default function ExampleQuery({text, onClick}) {
  return (
    <div
      className="mt-4 hover:scale-105 transition-all inline-block bg-white/30 text-white px-4 py-1 rounded-full"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <img
        src="/sparkles.png"
        alt="Sparkles"
        className="inline-block w-5 h-5 mr-2 align-middle"
      />
      <span className="align-middle text-sm">{text}</span>
    </div>
  );
}
