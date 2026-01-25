export default function SortSelector({ sortOrder, setSortOrder }) {
  const options = [
    { key: 'color', label: '色順' },
    { key: 'series', label: 'シリーズ順' },
  ];

  return (
    <div className="flex justify-center space-x-2 my-4">
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => setSortOrder(option.key)}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            sortOrder === option.key
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
