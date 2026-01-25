import * as d3 from 'd3';
import { useMemo } from 'react';
import AnimatedBars from './AnimatedBars';
import { getPrimaryColorCategory } from '../utils/colorUtils.jsx';

export default function RadialBarChart({
  data,
  metric,
  sortOrder,
  innerRadius,
  outerRadius,
  onBarHover,
  onBarLeave,
  onBarClick,
}) {
  const angle = useMemo(
    () =>
      d3
        .scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, 2 * Math.PI])
        .padding(0.08),
    [data],
  );

  const radius = useMemo(
    () => d3.scaleLinear().domain([0, 10]).range([innerRadius, outerRadius]),
    [innerRadius, outerRadius],
  );

  const ticksData = useMemo(() => {
    if (!data.length || sortOrder !== 'color') return [];

    const groupedByColor = data.reduce((acc, character) => {
      const category = getPrimaryColorCategory(character.themeColour);
      if (category === 'Unknown') return acc;

      if (!acc[category]) acc[category] = [];
      acc[category].push(character);
      return acc;
    }, {});

    return Object.entries(groupedByColor).map(([category, characters]) => {
      const totalScore = characters.reduce((sum, char) => {
        const score = char.scores?.[metric];
        return typeof score === 'number' ? sum + score : sum;
      }, 0);

      const average =
        characters.length > 0 ? totalScore / characters.length : 0;

      const firstChar = characters[0];
      const lastChar = characters[characters.length - 1];

      const startAngle = angle(firstChar.name);
      const endAngle = angle(lastChar.name) + angle.bandwidth();
      const midAngle = (startAngle + endAngle) / 2;

      return { category, average, startAngle, endAngle, midAngle };
    });
  }, [data, metric, angle, sortOrder]);

  const arcGenerator = useMemo(() => d3.arc(), []);

  // 平均線の太さ
  const arcThickness = 2;
  // 白フチの追加太さ
  const outlineWidth = 3;

  const categoryToColor = (category) => {
    if (!category) return '#9ca3af';
    if (category === 'Rainbow') return '#8b00ff'; // 代表色
    return category.toLowerCase();
  };

  return (
    <>
      <AnimatedBars
        data={data}
        metric={metric}
        angle={angle}
        radius={radius}
        innerRadius={innerRadius}
        onBarHover={onBarHover}
        onBarLeave={onBarLeave}
        onBarClick={onBarClick}
      />

      {/* 目盛り・平均線*/}
      <g style={{ pointerEvents: 'none' }}>
        {/* 背景の同心円グリッド */}
        {radius
          .ticks(4)
          .slice(1)
          .map((tickValue) => (
            <g key={tickValue}>
              <circle
                cx={0}
                cy={0}
                r={radius(tickValue)}
                fill="none"
                stroke="rgba(0, 0, 0, 0.1)"
                strokeWidth={1}
                strokeDasharray="2 4"
              />
              <text
                x={3}
                y={-radius(tickValue) - 3}
                textAnchor="start"
                fill="rgba(0, 0, 0, 0.4)"
                fontSize="10"
              >
                {tickValue}
              </text>
            </g>
          ))}

        {/* 色セグメントごとの平均値（白フチ付きの線） */}
        {sortOrder === 'color' &&
          ticksData.map((tick) => {
            if (!tick.average || tick.average === 0) return null;

            const c = categoryToColor(tick.category);
            const r = radius(tick.average);

            const d = arcGenerator({
              innerRadius: r,
              outerRadius: r, // 線として描画
              startAngle: tick.startAngle,
              endAngle: tick.endAngle,
            });

            return (
              <g key={`avg-${tick.category}`}>
                {/* 白フチ（下） */}
                <path
                  d={d}
                  fill="none"
                  stroke="#ffffffff"
                  strokeWidth={arcThickness + outlineWidth * 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.8}
                />
                {/* 色（上） */}
                <path
                  d={d}
                  fill="none"
                  stroke={c}
                  strokeWidth={arcThickness}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.95}
                  style={{
                    filter: `drop-shadow(0 0 1px ${c})`,
                  }}
                />
              </g>
            );
          })}
      </g>
    </>
  );
}
