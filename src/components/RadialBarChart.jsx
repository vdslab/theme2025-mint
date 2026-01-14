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
    </>
  );
}
