import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { getBarColor } from '../utils/colorUtils.jsx';
import { PERSONALITY_METRICS } from '../constants/personality_metrics';

export default function AnimatedBars({
  data,
  metric,
  angle,
  radius,
  innerRadius,
  onBarHover,
  onBarLeave,
  onBarClick,
}) {
  const ref = useRef(null);
  const previousRadii = useRef(new Map());

  const getTooltipText = useCallback(
    (d) => {
      const cureName = d.cure || '（不明）';
      const score = d.scores?.[metric] ?? '—';
      const metricLabel =
        PERSONALITY_METRICS.find((m) => m.key === metric)?.label || metric;
      return `${cureName}\n${metricLabel}: ${score}`;
    },
    [metric],
  );

  useEffect(() => {
    const g = d3.select(ref.current);

    const arcGenerator = d3.arc().innerRadius(innerRadius);

    // enter/update 共通のイベント設定
    const applyInteractions = (sel) =>
      sel
        .style('pointer-events', 'auto')
        .style('cursor', 'pointer')
        .on('mouseover', (event, d) => {
          if (!onBarHover) return;
          const tooltipText = getTooltipText(d);
          onBarHover(tooltipText, { x: event.clientX, y: event.clientY });
        })
        .on('mouseout', () => {
          if (onBarLeave) onBarLeave();
        })
        .on('click', (_event, d) => {
          if (onBarClick) onBarClick(d);
        });

    g.selectAll('path')
      .data(data, (d) => d.name)
      .join(
        (enter) =>
          applyInteractions(
            enter
              .append('path')
              .attr('fill', (d) => getBarColor(d.themeColour))
              .attr('opacity', 0.7)
              .each(function (d) {
                previousRadii.current.set(
                  d.name,
                  radius(d.scores?.[metric] ?? 0),
                );
              })
              .attr('d', (d) =>
                arcGenerator
                  .outerRadius(radius(d.scores?.[metric] ?? 0))
                  .startAngle(angle(d.name))
                  .endAngle(angle(d.name) + angle.bandwidth())(d),
              ),
          ),
        (update) =>
          applyInteractions(update)
            .transition()
            .duration(750)
            .attr('fill', (d) => getBarColor(d.themeColour))
            .attr('opacity', 0.7)
            .attrTween('d', function (d) {
              const finalRadius = radius(d.scores?.[metric] ?? 0);
              const initialRadius =
                previousRadii.current.get(d.name) ?? innerRadius;

              previousRadii.current.set(d.name, finalRadius);

              const i = d3.interpolate(initialRadius, finalRadius);

              return (t) =>
                arcGenerator
                  .outerRadius(i(t))
                  .startAngle(angle(d.name))
                  .endAngle(angle(d.name) + angle.bandwidth())(d);
            }),
        (exit) => exit.remove(),
      );
  }, [
    data,
    metric,
    angle,
    radius,
    innerRadius,
    onBarHover,
    onBarLeave,
    onBarClick,
    getTooltipText,
  ]);

  return <g ref={ref} />;
}
