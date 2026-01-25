import { useState, useEffect } from 'react';

import MetricSelector from './MetricSelector';
import Chart from './Chart';
import TooltipPortal from './TooltipPortal';
import { PERSONALITY_METRICS } from '../constants/personality_metrics';
import { createColorSorter } from '../utils/colorUtils.jsx';

export default function PrecureVisualization({ size, onSelectCharacter }) {
  const [data, setData] = useState([]);
  const [metric, setMetric] = useState(PERSONALITY_METRICS[0].key);
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: '',
    position: { x: 0, y: 0 },
  });

  useEffect(() => {
    fetch('/data/precure_profile.json')
      .then((res) => res.json())
      .then((json) => {
        // 色に基づいたソートを実行
        const colorSorter = createColorSorter();
        json.sort(colorSorter);

        setData(json);
        const firstValidCharacter = json.find(
          (c) => c.YouTube && c.YouTube.length > 0,
        );
        if (firstValidCharacter) {
          onSelectCharacter(firstValidCharacter);
        }
      });
  }, []);

  const handleNodeClick = (characterData) => {
    if (characterData) {
      onSelectCharacter(characterData);
    }
  };

  const handleNodeHover = (content, { x, y }) => {
    setTooltip({ visible: true, content, position: { x, y } });
  };

  const handleNodeLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  if (!data.length) {
    return <div className="p-6">loading...</div>;
  }

  return (
    <>
      <TooltipPortal {...tooltip} />

      <div>
        <div
          className="relative"
          style={{ width: size, height: size, margin: '0 auto' }}
        >
          {/* チャート */}
          <Chart
            data={data}
            metric={metric}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            onNodeLeave={handleNodeLeave}
          />
        </div>

        {/* メトリックセレクター */}
        <MetricSelector
          metricsList={PERSONALITY_METRICS}
          metric={metric}
          setMetric={setMetric}
        />
      </div>
    </>
  );
}
