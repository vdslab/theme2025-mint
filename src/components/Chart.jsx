import Nodes from './Nodes';
import RadialBarChart from './RadialBarChart';

export default function Chart({
  data,
  metric,
  onNodeClick,
  onNodeHover,
  onNodeLeave,
}) {
  const size = 900;
  // ラベルが見切れないように、全体的に半径を小さくする
  const ringRadius = 315;
  const barInner = 330;
  const barOuterMax = 430;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        pointerEvents: 'none',
      }}
    >
      <Nodes
        data={data}
        radius={10}
        center={size / 2}
        ringRadius={ringRadius}
        metric={metric}
        onNodeClick={onNodeClick}
        onNodeHover={onNodeHover}
        onNodeLeave={onNodeLeave}
      />
      <svg
        width={size}
        height={size}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <RadialBarChart
            data={data}
            metric={metric}
            innerRadius={barInner}
            outerRadius={barOuterMax}
          />
        </g>
      </svg>
    </div>
  );
}
