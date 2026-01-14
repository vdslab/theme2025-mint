import { getNodeStyle } from '../utils/colorUtils';

export default function Nodes({ data, radius = 6, center, ringRadius = 350 }) {
  const n = data.length;
  const offset = Math.PI / n; // ノード間隔半分のオフセット

  const nodesData = data.map((d, i) => {
    const theta = (2 * Math.PI * i) / n + offset;
    // SVGの座標系からCSSの座標系に変換するため、Y軸を反転させない
    const x = ringRadius * Math.sin(theta);
    const y = -ringRadius * Math.cos(theta);

    return {
      ...d,
      x,
      y,
    };
  });

  const containerStyle = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: `${ringRadius * 2}px`,
    height: `${ringRadius * 2}px`,
    transform: 'translate(-50%, -50%)',
  };

  return (
    <div style={containerStyle}>
      {nodesData.map((d, i) => {
        const nodeStyle = {
          position: 'absolute',
          // 中心からの相対位置を計算
          left: `calc(50% + ${d.x}px)`,
          top: `calc(50% + ${d.y}px)`,
          // ノード自体の中心を合わせる
          transform: 'translate(-50%, -50%)',
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          ...getNodeStyle(d.themeColour),
        };

        return (
          <div
            key={i}
            style={nodeStyle}
            className="group flex items-center justify-center rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-125 cursor-pointer"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-center break-words px-1 transition-opacity duration-300">
              {d.cure || 'Unknown'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
