function isValidCssColor(color) {
  const s = new Option().style;
  s.color = color;
  return s.color !== '';
}

function resolveNodeColor(themeColour) {
  if (!themeColour) return '#000000';

  // main が文字列かつ有効な CSS カラーであればそれを返す
  if (typeof themeColour.main === 'string' && isValidCssColor(themeColour.main)) {
    return themeColour.main;
  }

  return '#000000';
}

export default function Nodes({ data, radius = 6, center, ringRadius = 350 }) {
  const n = data.length;
  const offset = Math.PI / n; // ノード間隔半分のオフセット

  const nodesData = data.map((d, i) => {
    const theta = (2 * Math.PI * i) / n + offset;
    const x = ringRadius * Math.sin(theta);
    const y = -ringRadius * Math.cos(theta);

    return {
      ...d,
      x,
      y,
      color: resolveNodeColor(d.themeColour),
    };
  });

  return (
    <>
      {nodesData.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={radius}
          fill={d.color}
          opacity={0.8}
        />
      ))}
    </>
  );
}
