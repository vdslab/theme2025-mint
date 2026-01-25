import React, { useMemo, useCallback } from 'react';
import {
  getNodeFill,
  getNodeGradientDefinition,
} from '../utils/colorUtils.jsx';
import { PERSONALITY_METRICS } from '../constants/personality_metrics';

export default function Nodes({
  data,
  radius,
  ringRadius,
  metric,
  onNodeClick,
  onNodeHover,
  onNodeLeave,
}) {
  const n = data?.length ?? 0;
  const offset = n > 0 ? Math.PI / n : 0;

  const getTooltipText = useCallback(
    (d) => {
      const cureName = d?.cure || '（不明）';
      const score = d?.scores?.[metric] ?? '—';
      const metricLabel =
        PERSONALITY_METRICS.find((m) => m.key === metric)?.label || metric;
      return `${cureName}\n${metricLabel}: ${score}`;
    },
    [metric],
  );

  const nodesData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    return data.map((d, i) => {
      const theta = (2 * Math.PI * i) / data.length + offset;

      // 安全でユニークなIDを作る（nameは衝突・不正文字の可能性があるので避ける）
      const rawId = d?.id ?? d?.cure ?? d?.name ?? i;
      const safeId = String(rawId).replace(/[^a-zA-Z0-9_-]/g, '_');
      const gradId = `node-grad-${safeId}-${i}`;

      const colors = Array.isArray(d?.themeColour)
        ? d.themeColour
        : [d?.themeColour];
      const useGradient =
        colors.filter(Boolean).length > 1 ||
        (colors.length === 1 &&
          typeof colors[0] === 'string' &&
          colors[0].toLowerCase() === 'rainbow');

      return {
        ...d,
        __i: i,
        __gradId: gradId,
        __useGradient: useGradient,
        x: ringRadius * Math.sin(theta),
        y: -ringRadius * Math.cos(theta),
      };
    });
  }, [data, ringRadius, offset]);

  if (!nodesData.length) return null;

  return (
    <>
      <defs>
        {nodesData
          .filter((d) => d.__useGradient)
          .map((d) => (
            <linearGradient
              key={d.__gradId}
              id={d.__gradId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              {getNodeGradientDefinition(d.themeColour)}
            </linearGradient>
          ))}
      </defs>

      {nodesData.map((d) => (
        <g
          key={d.__gradId}
          transform={`translate(${d.x}, ${d.y})`}
          className="group cursor-pointer"
          onMouseEnter={(e) =>
            onNodeHover?.(getTooltipText(d), { x: e.clientX, y: e.clientY })
          }
          onMouseLeave={() => onNodeLeave?.()}
          onClick={() => onNodeClick?.(d)}
        >
          <circle
            r={radius}
            fill={
              d.__useGradient
                ? `url(#${d.__gradId})`
                : getNodeFill(d.themeColour)
            }
          />
        </g>
      ))}
    </>
  );
}
