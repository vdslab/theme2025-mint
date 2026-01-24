import { useState, useEffect, useMemo } from 'react';
import PrecureVisualization from './PrecureVisualization.jsx';
import DetailPanel from './DetailPanel';
import StripPlot from './StripPlot.jsx';
import { createColorSorter } from '../utils/colorUtils';

export default function Main() {
  const [data, setData] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const BASE_VIS_SIZE = 700;
  const VIS_SCALE = 0.85; // ★少し小さく
  const visSize = useMemo(() => Math.round(BASE_VIS_SIZE * VIS_SCALE), []);

  useEffect(() => {
    fetch('/data/precure_profile.json')
      .then((res) => res.json())
      .then((json) => {
        const colorSorter = createColorSorter();
        json.sort(colorSorter);
        setData(json);

        const firstValidCharacter = json.find(
          (c) => c.YouTube && c.YouTube.length > 0,
        );
        if (firstValidCharacter) setSelectedCharacter(firstValidCharacter);
      });
  }, []);

  if (!data.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-100 grid overflow-x-hidden"
      style={{
        // ★中央を固定pxやめて「可変 + 上限」
        // 280px / 中央 min 360 max 720 / 右は残り（最低でも320）
        gridTemplateColumns: '280px minmax(360px, 720px) minmax(320px, 1fr)',
      }}
    >
      {/* 左パネル：スクロールは外側だけ */}
      <aside className="border-r bg-white h-screen overflow-y-auto overflow-x-hidden">
        <StripPlot
          data={data}
          selectedCharacter={selectedCharacter}
          onSelectCharacter={setSelectedCharacter}
        />
      </aside>

      {/* 中央：常にど真ん中 */}
      <main className="h-screen flex items-center justify-center overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <PrecureVisualization
            data={data}
            size={visSize} // ★縮小したサイズを渡す
            selectedCharacter={selectedCharacter}
            onSelectCharacter={setSelectedCharacter}
          />
        </div>
      </main>

      {/* 右：スクロールは右側だけに（長い説明が溢れるので） */}
      <aside className="border-l bg-white h-screen overflow-y-auto overflow-x-hidden">
        <DetailPanel data={selectedCharacter} />
      </aside>
    </div>
  );
}
