import Nodes from './Nodes';
import RadialBarChart from './RadialBarChart';

export default function Chart({ data, metric }) {
  const size = 900;

  const ringRadius = 340;

  const barInner = 350;
  const barOuterMax = 450;

  return (
    <>
      <svg width={size} height={size}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <Nodes data={data} radius={6} center={size / 2} ringRadius={ringRadius} />
          <RadialBarChart
            data={data}
            metric={metric}
            innerRadius={barInner}
            outerRadius={barOuterMax}
          />
        </g>
      </svg>
    </>
  );
}
