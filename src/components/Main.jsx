import { useState, useEffect } from 'react';
import PrecureVisualization from './PrecureVisualization.jsx';
import DetailPanel from './DetailPanel';
import StripPlot from './StripPlot.jsx'; // 新しく追加
import { VIS_SIZE } from '../constants/layout';
import { createColorSorter } from '../utils/colorUtils';

export default function Main() {
  const [data, setData] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

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
        if (firstValidCharacter) {
          setSelectedCharacter(firstValidCharacter);
        }
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
      className="grid min-h-screen bg-gray-100"
      style={{
        gridTemplateColumns: `280px ${VIS_SIZE}px 1fr`,
      }}
    >
      {/* 左パネル：ストリップチャート */}
      <aside className="border-r bg-white overflow-y-auto h-screen">
        <StripPlot
          data={data}
          selectedCharacter={selectedCharacter}
          onSelectCharacter={setSelectedCharacter}
        />
      </aside>

      <main className="flex flex-col items-center py-8 sticky top-0 h-screen">
        <PrecureVisualization
          data={data}
          size={VIS_SIZE}
          selectedCharacter={selectedCharacter}
          onSelectCharacter={setSelectedCharacter}
        />
      </main>

      {/* 詳細パネル */}
      <aside className="border-l bg-white">
        <DetailPanel data={selectedCharacter} />
      </aside>
    </div>
  );
}
