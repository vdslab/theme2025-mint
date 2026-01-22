import { useState } from 'react';
import PrecureVisualization from './PrecureVisualization.jsx';
import DetailPanel from './DetailPanel';
import { VIS_SIZE } from '../constants/layout';

export default function Main() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  return (
    <div
      className="grid min-h-screen bg-gray-100"
      style={{
        gridTemplateColumns: `1fr ${VIS_SIZE}px 1fr`,
      }}
    >
      {/* 左余白 */}
      <div />

      <main className="flex flex flex-col items-center py-8">
        <PrecureVisualization
          size={VIS_SIZE}
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
