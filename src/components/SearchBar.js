export default function SearchBar() {
  return (
    <div className="flex justify-center mt-4">
      <input
        type="text"
        placeholder="Enter your academic search query..."
        className="bg-white px-4 py-2 rounded-l-full w-full max-w-lg focus:outline-none placeholder:text-gray-500"
      />
      <button className="bg-orange-700 hover:bg-orange-800 text-white px-5 py-2 rounded-r-full">
        Search
      </button>
    </div>
  );
}
