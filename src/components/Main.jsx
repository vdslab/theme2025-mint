import { useState } from 'react';
import PrecureVisualization from './PrecureVisualization.jsx';
import DetailPanel from './DetailPanel';

export default function Main() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  return (
    <div className="grid grid-cols-3 min-h-screen bg-gray-100">
      {/* 左余白 */}
      <div />

      <main className="flex flex flex-col items-center py-8">
        <PrecureVisualization
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
