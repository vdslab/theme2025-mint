import { getNodeFill } from '../utils/colorUtils';
import { PERSONALITY_METRICS } from '../constants/personality_metrics';

export default function Nodes({
  data,
  radius,
  ringRadius,
  metric,
  onNodeClick,
  onNodeHover,
  onNodeLeave,
}) {
  const n = data.length;
  const offset = Math.PI / n;

  const nodesData = data.map((d, i) => {
    const theta = (2 * Math.PI * i) / n + offset;
    return {
      ...d,
      x: ringRadius * Math.sin(theta),
      y: -ringRadius * Math.cos(theta),
    };
  });

  const getTooltipText = (d) => {
    const cureName = d.cure || '（不明）';
    const score = d.scores?.[metric] ?? '—';
    const metricLabel =
      PERSONALITY_METRICS.find((m) => m.key === metric)?.label || metric;
    return `${cureName}\n${metricLabel}: ${score}`;
  };

  return (
    <>
      {nodesData.map((d) => (
        <g
          key={d.name}
          transform={`translate(${d.x}, ${d.y})`}
          onMouseEnter={(e) =>
            onNodeHover(getTooltipText(d), { x: e.clientX, y: e.clientY })
          }
          onMouseLeave={onNodeLeave}
          onClick={() => onNodeClick(d)}
          className="cursor-pointer"
        >
          <circle
            r={radius}
            fill={getNodeFill(d.themeColour)}
            className="
              transition-transform
              duration-300
              ease-out
              origin-center
              group-hover:scale-125
            "
          />
        </g>
      ))}
    </>
  );
}
