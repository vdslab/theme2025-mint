import { useEffect, useRef } from 'react';
import RadialBars from './RadialBars';

export default function Chart({ data, metric }) {
  const size = 900;

  const barInner = 350;
  const barOuterMax = 450;

  const ref = useRef(null);

  return (
    <>
      <svg width={size} height={size}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <RadialBars
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
