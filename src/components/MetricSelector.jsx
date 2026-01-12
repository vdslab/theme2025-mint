export default function MetricSelector({ metricsList, metric, setMetric }) {
  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {metricsList.map((m) => (
          <button
            key={m}
            className={`btn btn-sm ${
              metric === m ? 'btn-primary' : 'btn-outline'
            }`}
            onClick={() => setMetric(m)}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
