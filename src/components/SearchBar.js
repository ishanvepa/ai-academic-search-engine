export default function SearchBar() {
  return (
    <div className="flex justify-center mt-4">
      <input
        type="text"
        placeholder="Enter your academic search query..."
        className="bg-white px-4 py-2 rounded-l-full w-full max-w-lg focus:outline-none focus:text-gray-600 placeholder:text-gray-400 placeholder:text-sm text-sm"
      />
      <button className="bg-amber-800 transition hover:bg-amber-900 text-white px-5 py-2 rounded-r-full">
        Search
      </button>
    </div>
  );
}
