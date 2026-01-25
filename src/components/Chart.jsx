import Links from './Links';
import Nodes from './Nodes';
import RadialBarChart from './RadialBarChart';

export default function Chart({
  data,
  links,
  hoveredNode,
  selectedNode,
  metric,
  onNodeClick,
  onNodeHover,
  onNodeLeave,
}) {
  const size = 700;
  // ラベルが見切れないように、全体的に半径を小さくする
  const ringRadius = 240;
  const barInner = 250;
  const barOuterMax = 350;

  const positionedData = (() => {
    if (!data || data.length === 0) return [];

    const n = data.length;
    const offset = Math.PI / n;

    return data.map((d, i) => {
      const theta = (2 * Math.PI * i) / n + offset;
      return {
        ...d,
        x: ringRadius * Math.sin(theta),
        y: -ringRadius * Math.cos(theta),
      };
    });
  })();

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        pointerEvents: 'none',
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'auto' }}
      >
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <Links
            nodes={positionedData}
            links={links}
            hoveredNode={hoveredNode}
            selectedNode={selectedNode}
          />

          <Nodes
            data={positionedData}
            radius={8}
            ringRadius={ringRadius}
            metric={metric}
            onNodeClick={onNodeClick}
            onNodeHover={onNodeHover}
            onNodeLeave={onNodeLeave}
          />

          <RadialBarChart
            data={data}
            metric={metric}
            innerRadius={barInner}
            outerRadius={barOuterMax}
            onBarHover={onNodeHover}
            onBarLeave={onNodeLeave}
            onBarClick={onNodeClick}
          />
        </g>
      </svg>
    </div>
  );
}
