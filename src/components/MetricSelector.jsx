export default function MetricSelector({ metricsList, metric, setMetric }) {
  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {metricsList.map((m) => {
          const isActive = metric === m.key;

          return (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`
                btn btn-sm
                ${
                  isActive
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }
              `}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
