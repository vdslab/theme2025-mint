import * as d3 from 'd3';
import { getMetricColor } from '../utils/colorUtils';

export default function RadialBarChart({
  data,
  metric,
  innerRadius,
  outerRadius,
}) {
  const angle = d3
    .scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, 2 * Math.PI])
    .padding(0.08);

  const radius = d3
    .scaleLinear()
    .domain([0, 10])
    .range([innerRadius, outerRadius]);

  const arcGenerator = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius((d) => radius(d.scores[metric]))
    .startAngle((d) => angle(d.name))
    .endAngle((d) => angle(d.name) + angle.bandwidth());

  // 現在選択されているメトリクスの色を取得
  const currentMetricColor = getMetricColor(metric);

  // 目盛りの定義
  const ticks = [
    { value: 1, angle: -90 },
    { value: 5, angle: -90 },
    { value: 10, angle: -90 },
  ];

  const tickLabelOffset = 12; // ラベルの位置調整用
  return (
    <>
      {data.map((d, i) => (
        <path
          key={i}
          d={arcGenerator(d)}
          fill={currentMetricColor}
          opacity={0.9}
        />
      ))}
      <g style={{ pointerEvents: 'none' }}>
        {/* 点線の同心円ガイド */}
        {ticks.map((tick) => (
          <circle
            key={`circle-${tick.value}`}
            cx={0}
            cy={0}
            r={radius(tick.value)}
            fill="none"
            stroke="rgba(0, 0, 0, 0.2)" // 少し薄く
            strokeWidth={1} // 少し細く
            strokeDasharray="4 4"
          />
        ))}

        {/* 目盛り線とラベル */}
        {ticks.map((tick) => {
          const r = radius(tick.value);
          return (
            <g key={`tick-${tick.value}`} transform={`rotate(${tick.angle})`}>
              {/* ラベル */}
              <g transform={`translate(${r + tickLabelOffset}, 0)`}>
                <text
                  x={0}
                  y={0}
                  dy="0.35em"
                  textAnchor="middle"
                  transform={`rotate(${-tick.angle})`}
                  fontSize="14"
                  fill="brack"
                  style={{
                    textShadow: '0 0 6px white, 0 0 6px white, 0 0 6px white',
                  }}
                >
                  {tick.value}
                </text>
              </g>
            </g>
          );
        })}
      </g>
    </>
  );
}
