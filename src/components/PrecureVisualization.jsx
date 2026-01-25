import { useState, useEffect, useMemo, useRef } from 'react';

import MetricSelector from './MetricSelector';
import SortSelector from './SortSelector';
import Chart from './Chart';
import TooltipPortal from './TooltipPortal';
import { PERSONALITY_METRICS } from '../constants/personality_metrics';
import { createColorSorter } from '../utils/colorUtils.jsx';

export default function PrecureVisualization({
  size,
  selectedCharacter,
  onSelectCharacter,
}) {
  const [originalData, setOriginalData] = useState([]);
  const [sortOrder, setSortOrder] = useState('color');
  const [metric, setMetric] = useState(PERSONALITY_METRICS[0].key);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: '',
    position: { x: 0, y: 0 },
  });
  const hoverTimeout = useRef(null);

  // Fetch original data once
  useEffect(() => {
    fetch('/data/precure_profile.json')
      .then((res) => res.json())
      .then((json) => {
        setOriginalData(json);
        const firstValidCharacter = json.find(
          (c) => c.YouTube && c.YouTube.length > 0,
        );
        if (firstValidCharacter) {
          onSelectCharacter(firstValidCharacter);
        }
      });
  }, [onSelectCharacter]);

  const data = useMemo(() => {
    if (sortOrder === 'color') {
      const colorSorter = createColorSorter();
      return [...originalData].sort(colorSorter);
    }
    // 'series' order (original JSON order)
    return originalData;
  }, [originalData, sortOrder]);


  // コンポーネントのアンマウント時にタイムアウトをクリア
  useEffect(() => {
    return () => {
      clearTimeout(hoverTimeout.current);
    };
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
          commonSeasons.forEach((season) => {
            allLinks.push({
              source: node1.name,
              target: node2.name,
              season: season,
            });
          });
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
    clearTimeout(hoverTimeout.current);
    setTooltip({ visible: true, content, position });
    setHoveredNode(node);
  };

  const handleNodeLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
    hoverTimeout.current = setTimeout(() => {
      setHoveredNode(null);
    }, 100);
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
            sortOrder={sortOrder}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            onNodeLeave={handleNodeLeave}
          />
        </div>
        <div className="flex justify-center items-center">
          <SortSelector sortOrder={sortOrder} setSortOrder={setSortOrder} />
          <MetricSelector
            metricsList={PERSONALITY_METRICS}
            metric={metric}
            setMetric={setMetric}
          />
        </div>
      </div>
    </>
  );
}
