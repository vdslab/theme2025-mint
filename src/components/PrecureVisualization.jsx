import { useState, useEffect } from 'react';

import MetricSelector from './MetricSelector';
import TransformationPlayer from './TransformationPlayer';
import Chart from './Chart';
import { PERSONALITY_METRICS } from '../constants/personality_metrics';

export default function PrecureVisualization() {
  const [data, setData] = useState([]);
  const [metric, setMetric] = useState(PERSONALITY_METRICS[0]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);

  useEffect(() => {
    fetch('/data/precure_profile.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        const firstValidCharacter = json.find((c) => c.YouTube);
        if (firstValidCharacter) {
          setSelectedVideoUrl(firstValidCharacter.YouTube);
        }
      });
  }, []);

  const handleNodeClick = (characterData) => {
    if (characterData && characterData.YouTube) {
      setSelectedVideoUrl(characterData.YouTube);
    }
  };

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

      <div className="relative w-[900px] h-[900px]">
        {/* 中央の YouTube */}
        <TransformationPlayer videoUrl={selectedVideoUrl} />

        {/* チャート */}
        <Chart data={data} metric={metric} onNodeClick={handleNodeClick} />
      </div>
    </>
  );
}
