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
  const n = data.length;
  const offset = Math.PI / n; // ノード間隔半分のオフセット

  const nodesData = data.map((d, i) => {
    const theta = (2 * Math.PI * i) / n + offset;
    const x = ringRadius * Math.sin(theta);
    const y = -ringRadius * Math.cos(theta);

    return {
      ...d,
      x,
      y,
    };
  });

  const getTooltipText = (d) => {
    const cureName = d.cure || '（不明）';
    const score = d.scores?.[metric] ?? '—';

    // metric (key) に対応する日本語ラベルを検索
    const metricLabel =
      PERSONALITY_METRICS.find((m) => m.key === metric)?.label || metric;

    return `${cureName}\n${metricLabel}: ${score}`;
  };

  const containerStyle = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: `${ringRadius * 2}px`,
    height: `${ringRadius * 2}px`,
    transform: 'translate(-50%, -50%)',
  };

  return (
    <div style={containerStyle} className="pointer-events-none">
      {nodesData.map((d, i) => {
        const nodeStyle = {
          position: 'absolute',
          left: `calc(50% + ${d.x}px)`,
          top: `calc(50% + ${d.y}px)`,
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
