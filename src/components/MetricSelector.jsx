export default function MetricSelector({ metricsList, metric, setMetric }) {
  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {metricsList.map((m) => (
          <button
            key={m.key}
            className={`btn btn-sm ${
              metric === m.key ? 'btn-primary' : 'btn-outline'
            }`}
            onClick={() => setMetric(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
