import { getNodeStyle } from '../utils/colorUtils';

export default function Nodes({
  data,
  radius = 6,
  metric,
  ringRadius = 350,
  onNodeClick,
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
    return `${cureName}\n${metric}: ${score}`;
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
            className="group tooltip tooltip-top flex items-center justify-center rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-125 cursor-pointer pointer-events-auto"
            data-tip={getTooltipText(d)}
            tabIndex="0"
            onClick={() => onNodeClick(d)}
          ></div>
        );
      })}
    </div>
  );
}
