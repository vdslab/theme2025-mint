import { useRef } from 'react';
import RadialBarChart from './RadialBarChart';

export default function Chart({ data, metric }) {
  const size = 900;

  const barInner = 350;
  const barOuterMax = 450;

  const ref = useRef(null);

  return (
    <>
      <svg width={size} height={size}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
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
