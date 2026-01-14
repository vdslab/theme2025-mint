import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { getMetricColor } from '../utils/colorUtils';

export default function AnimatedBars({
  data,
  metric,
  angle,
  radius,
  innerRadius,
}) {
  const ref = useRef(null);
  // 前回の半径を保存するためのref
  const previousRadii = useRef(new Map());

  useEffect(() => {
    const g = d3.select(ref.current);
    const color = getMetricColor(metric);

    const arcGenerator = d3.arc().innerRadius(innerRadius);

    g.selectAll('path')
      .data(data, (d) => d.name)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('fill', color)
            .attr('opacity', 0.9)
            .each(function (d) {
              // 初回描画時の半径をDOMではなくrefに保存
              previousRadii.current.set(d.name, radius(d.scores[metric]));
            })
            .attr('d', (d) =>
              arcGenerator
                .outerRadius(radius(d.scores[metric]))
                .startAngle(angle(d.name))
                .endAngle(angle(d.name) + angle.bandwidth())(d),
            ),
        (update) =>
          update
            .transition()
            .duration(750)
            .attr('fill', color)
            .attrTween('d', function (d) {
              const finalRadius = radius(d.scores[metric]);
              // refから前回の半径を取得、なければ内側半径を初期値とする
              const initialRadius =
                previousRadii.current.get(d.name) || innerRadius;

              // 新しい半径を次回のためにrefに保存
              previousRadii.current.set(d.name, finalRadius);

              const i = d3.interpolate(initialRadius, finalRadius);

              return (t) => {
                return arcGenerator
                  .outerRadius(i(t))
                  .startAngle(angle(d.name))
                  .endAngle(angle(d.name) + angle.bandwidth())(d);
              };
            }),
        (exit) => exit.remove(),
      );
  }, [data, metric, angle, radius, innerRadius]);

  return <g ref={ref} />;
}
