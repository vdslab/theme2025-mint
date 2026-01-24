import * as d3 from 'd3';
import { useMemo } from 'react';
import AnimatedBars from './AnimatedBars';
import { getPrimaryColorCategory } from '../utils/colorUtils';

export default function RadialBarChart({
  data,
  metric,
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
    if (!data.length) return [];

    const groupedByColor = data.reduce((acc, character) => {
      const category = getPrimaryColorCategory(character.themeColour);
      if (category === 'Unknown') return acc;

      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(character);
      return acc;
    }, {});

    return Object.entries(groupedByColor).map(([category, characters]) => {
      // 平均スコアの計算
      const totalScore = characters.reduce((sum, char) => {
        const score = char.scores?.[metric];
        return typeof score === 'number' ? sum + score : sum;
      }, 0);
      const average =
        characters.length > 0 ? totalScore / characters.length : 0;

      const firstChar = characters[0];
      const lastChar = characters[characters.length - 1];

      const startAngle = angle(firstChar.name);
      // バンドの右端までの角度
      const endAngle = angle(lastChar.name) + angle.bandwidth();

      // ラベル表示用の中間角度
      const midAngle = (startAngle + endAngle) / 2;

      return { category, average, startAngle, endAngle, midAngle };
    });
  }, [data, metric, angle]);

  const arcGenerator = useMemo(() => d3.arc(), []);
  const arcThickness = 3;

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

      {/* 目盛りを追加 */}
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

        {/* 色セグメントごとの平均値の円弧 */}
        {ticksData.map((tick) => {
          if (tick.average === 0) return null;
          const arcPath = arcGenerator({
            innerRadius: radius(tick.average) - arcThickness / 2,
            outerRadius: radius(tick.average) + arcThickness / 2,
            startAngle: tick.startAngle,
            endAngle: tick.endAngle,
          });

          return (
            <path
              key={`arc-${tick.category}`}
              d={arcPath}
              fill={tick.category.toLowerCase()}
              style={{
                filter: `drop-shadow(0 0 2px ${tick.category.toLowerCase()})`,
              }}
            />
          );
        })}
        {/* 目盛りラベルの追加もしたい */}
      </g>
    </>
  );
}
