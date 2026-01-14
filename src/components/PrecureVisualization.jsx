import { useState, useEffect } from 'react';

import MetricSelector from './MetricSelector';
import TransformationPlayer from './TransformationPlayer';
import Chart from './Chart';
import { PERSONALITY_METRICS } from '../constants/personality_metrics';

export default function PrecureVisualization() {
  const [data, setData] = useState([]);
  const [metric, setMetric] = useState(PERSONALITY_METRICS[0]);

  useEffect(() => {
    fetch('/data/precure_profile_with_scores.json')
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data.length) {
    return <div className="p-6">loading...</div>;
  }

  return (
    <>
      <MetricSelector
        metricsList={PERSONALITY_METRICS}
        metric={metric}
        setMetric={setMetric}
      />

      <div className="relative w-[800px] h-[800px]">
        {/* 中央の YouTube */}
        <TransformationPlayer />

        {/* チャート */}
        <Chart data={data} metric={metric} />
      </div>
    </>
  );
}
