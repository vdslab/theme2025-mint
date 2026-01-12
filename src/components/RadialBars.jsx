import * as d3 from 'd3';

export default function RadialBars({
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

  return (
    <>
      {data.map((d, i) => (
        <path key={i} d={arcGenerator(d)} fill="#facc15" opacity={0.9} />
      ))}
    </>
  );
}
