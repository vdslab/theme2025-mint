import Nodes from './Nodes';
import RadialBarChart from './RadialBarChart';

export default function Chart({
  data,
  metric,
  onNodeClick,
  onNodeHover,
  onNodeLeave,
  // ここで円のサイズを変えます！！！！！！
  size = 600,
}) {
  const ringRadius = Math.round(size * (240 / 700));
  const barInner = Math.round(size * (250 / 700));
  const barOuterMax = Math.round(size * (350 / 700));

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
        radius={8}
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
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      >
        <g transform={`translate(${size / 2}, ${size / 2})`}>
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
