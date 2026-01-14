import * as d3 from 'd3';
import { getNodeStyle } from '../utils/colorUtils';
import { PERSONALITY_METRICS } from '../constants/personality_metrics';

export default function Nodes({
  data,
  radius = 6,
  metric,
  ringRadius = 350,
  onNodeClick,
  onNodeHover,
  onNodeLeave,
}) {
  const isPersonalityMetric = PERSONALITY_METRICS.some((m) => m.key === metric);

  let nodesData;
  let containerStyle;

  const size = ringRadius * 2;

  if (isPersonalityMetric) {
    const n = data.length;
    const offset = Math.PI / n;

    nodesData = data.map((d, i) => {
      const theta = (2 * Math.PI * i) / n + offset;
      const x = ringRadius * Math.sin(theta);
      const y = -ringRadius * Math.cos(theta);
      return { ...d, x, y };
    });

    containerStyle = {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: `${size}px`,
      height: `${size}px`,
      transform: 'translate(-50%, -50%)',
    };
  } else {
    const width = 800; // 水平配置の幅
    const height = 100; // 水平配置の高さ
    const xScale = d3
      .scalePoint()
      .domain(data.map((d) => d.name))
      .range([radius, width - radius])
      .padding(0.5);

    nodesData = data.map((d) => ({
      ...d,
      x: xScale(d.name),
      y: height / 2,
    }));

    containerStyle = {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: `${width}px`,
      height: `${height}px`,
      transform: 'translate(-50%, -50%)',
    };
  }

  const getTooltipText = (d) => {
    const cureName = d.cure || '（不明）';
    const score = d.scores?.[metric] ?? '—';
    const metricLabel =
      PERSONALITY_METRICS.find((m) => m.key === metric)?.label || metric;
    return `${cureName}\n${metricLabel}: ${score}`;
  };

  return (
    <div style={containerStyle} className="pointer-events-none">
      {nodesData.map((d, i) => {
        const nodeStyle = {
          position: 'absolute',
          // isPersonalityMetricに応じて座標計算の基準を変える
          left: isPersonalityMetric ? `calc(50% + ${d.x}px)` : `${d.x}px`,
          top: isPersonalityMetric ? `calc(50% + ${d.y}px)` : `${d.y}px`,
          transform: 'translate(-50%, -50%)',
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          ...getNodeStyle(d.themeColour),
        };

        return (
          <div
            key={i}
            style={nodeStyle}
            className="group flex items-center justify-center rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-125 cursor-pointer pointer-events-auto"
            tabIndex="0"
            onClick={() => onNodeClick(d)}
            onMouseEnter={(e) =>
              onNodeHover(getTooltipText(d), { x: e.clientX, y: e.clientY })
            }
            onMouseLeave={onNodeLeave}
          ></div>
        );
      })}
    </div>
  );
}
