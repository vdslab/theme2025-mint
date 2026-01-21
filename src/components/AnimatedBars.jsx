import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { getMetricColor } from '../utils/colorUtils';
import { PERSONALITY_METRICS } from '../constants/personality_metrics';

export default function AnimatedBars({
  data,
  metric,
  angle,
  radius,
  innerRadius,
  onBarHover,
  onBarLeave,
}) {
  const ref = useRef(null);
  const previousRadii = useRef(new Map());

  const getTooltipText = (d) => {
    const cureName = d.cure || '（不明）';
    const score = d.scores?.[metric] ?? '—';
    const metricLabel =
      PERSONALITY_METRICS.find((m) => m.key === metric)?.label || metric;
    return `${cureName}\n${metricLabel}: ${score}`;
  };

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
            .style('pointer-events', 'auto') // イベントを受け取るために必要
            .each(function (d) {
              previousRadii.current.set(d.name, radius(d.scores[metric]));
            })
            .attr('d', (d) =>
              arcGenerator
                .outerRadius(radius(d.scores[metric]))
                .startAngle(angle(d.name))
                .endAngle(angle(d.name) + angle.bandwidth())(d),
            )
            .on('mouseover', (event, d) => {
              if (onBarHover) {
                const tooltipText = getTooltipText(d);
                onBarHover(tooltipText, { x: event.clientX, y: event.clientY });
              }
            })
            .on('mouseout', () => {
              if (onBarLeave) {
                onBarLeave();
              }
            }),
        (update) =>
          update
            .call((update) =>
              update
                .on('mouseover', (event, d) => {
                  if (onBarHover) {
                    const tooltipText = getTooltipText(d);
                    onBarHover(tooltipText, {
                      x: event.clientX,
                      y: event.clientY,
                    });
                  }
                })
                .on('mouseout', () => {
                  if (onBarLeave) {
                    onBarLeave();
                  }
                }),
            )
            .transition()
            .duration(750)
            .attr('fill', color)
            .attrTween('d', function (d) {
              const finalRadius = radius(d.scores[metric]);
              const initialRadius =
                previousRadii.current.get(d.name) || innerRadius;
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
  }, [data, metric, angle, radius, innerRadius, onBarHover, onBarLeave]);

  return <g ref={ref} />;
}
