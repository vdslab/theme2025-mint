import { useState, useEffect } from 'react';

import MetricSelector from './MetricSelector';
import TransformationPlayer from './TransformationPlayer';
import Chart from './Chart';
import { PERSONALITY_METRICS } from '../constants/personality_metrics';
import { normalizeYouTubeLinks } from '../utils/youtubeUtils';

export default function PrecureVisualization() {
  const [data, setData] = useState([]);
  const [metric, setMetric] = useState(PERSONALITY_METRICS[0]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    fetch('/data/precure_profile.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        const firstValidCharacter = json.find(
          (c) => c.YouTube && c.YouTube.length > 0,
        );
        if (firstValidCharacter) {
          setSelectedCharacter(firstValidCharacter);
        }
      });
  }, []);

  const handleNodeClick = (characterData) => {
    if (characterData) {
      setSelectedCharacter(characterData);
    }
  };

  if (!data.length) {
    return <div className="p-6">loading...</div>;
  }

  const videoLinks = selectedCharacter
    ? normalizeYouTubeLinks(selectedCharacter.YouTube)
    : [];

  return (
    <>
      <MetricSelector
        metricsList={PERSONALITY_METRICS}
        metric={metric}
        setMetric={setMetric}
      />

      <div className="relative w-[900px] h-[900px]">
        {/* 中央の YouTube */}
        {/* videoLinksプロパティとして正規化済みのデータを渡す */}
        <TransformationPlayer videoLinks={videoLinks} />

        {/* チャート */}
        <Chart data={data} metric={metric} onNodeClick={handleNodeClick} />
      </div>
    </>
  );
}
