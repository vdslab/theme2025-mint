import { useState, useEffect, useMemo } from 'react';

import MetricSelector from './MetricSelector';
import Chart from './Chart';
import TooltipPortal from './TooltipPortal';
import { PERSONALITY_METRICS } from '../constants/personality_metrics';
import { createColorSorter } from '../utils/colorUtils.jsx';

export default function PrecureVisualization({
  size,
  selectedCharacter,
  onSelectCharacter,
}) {
  const [data, setData] = useState([]);
  const [metric, setMetric] = useState(PERSONALITY_METRICS[0].key);
  const [hoveredNode, setHoveredNode] = useState(null);
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

  const links = useMemo(() => {
    if (!data.length) return [];
    const allLinks = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const node1 = data[i];
        const node2 = data[j];
        if (node1.season && node2.season) {
          const commonSeasons = node1.season.filter((season) =>
            node2.season.includes(season),
          );
          if (commonSeasons.length > 0) {
            allLinks.push({
              source: node1.name,
              target: node2.name,
              season: commonSeasons[0],
            });
          }
        }
      }
    }
    return allLinks;
  }, [data]);

  const handleNodeClick = (characterData) => {
    if (characterData) {
      onSelectCharacter(characterData);
    }
  };

  const handleNodeHover = (node, content, position) => {
    setTooltip({ visible: true, content, position });
    setHoveredNode(node);
  };

  const handleNodeLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
    setHoveredNode(null);
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
            links={links}
            hoveredNode={hoveredNode}
            selectedNode={selectedCharacter}
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
