export default function Links({ data }) {
  const seasonMap = new Map();

  data.forEach((d) => {
    d.season.forEach((s) => {
      if (!seasonMap.has(s)) seasonMap.set(s, []);
      seasonMap.get(s).push(d);
    });
  });

  const paths = [];

  seasonMap.forEach((nodes, season) => {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];

        paths.push(
          <line
            key={`${season}-${a.name}-${b.name}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="red"
            strokeWidth={3}
          />,
        );
      }
    }
  });

  return <>{paths}</>;
}
