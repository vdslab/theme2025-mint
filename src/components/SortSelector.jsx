export default function SortSelector({ sortOrder, setSortOrder }) {
  const options = [
    { key: 'color', label: '色順' },
    { key: 'series', label: '作品順' },
  ];

  return (
    <div className="flex justify-center my-4">
      <div className="inline-flex rounded-lg overflow-hidden border border-gray-300">
        {options.map((option) => (
          <button
            key={option.key}
            onClick={() => setSortOrder(option.key)}
            className={`px-10 py-2 text-sm font-medium transition-colors duration-150
              ${
                sortOrder === option.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
