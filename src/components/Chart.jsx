import Nodes from './Nodes';
import RadialBarChart from './RadialBarChart';

export default function Chart({ data, metric }) {
  const size = 900;
  const ringRadius = 340;
  const barInner = 350;
  const barOuterMax = 450;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
                <Nodes
        data={data}
        radius={10}
        center={size / 2}
        ringRadius={ringRadius}
        metric={metric}
      />      <svg
        width={size}
        height={size}
        style={{ position: 'absolute', top: 0, left: 0 }}
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
