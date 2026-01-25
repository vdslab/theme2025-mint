import TransformationPlayer from './TransformationPlayer';
import { PERSONALITY_METRICS } from '../constants/personality_metrics';
import { normalizeYouTubeLinks } from '../utils/youtubeUtils';

export default function DetailPanel({ data }) {
  const PERSONALITY_LABEL_MAP = Object.fromEntries(
    PERSONALITY_METRICS.map(({ key, label }) => [key, label]),
  );

  const videoLinks = data ? normalizeYouTubeLinks(data.YouTube) : [];

  return (
    <div
      style={{
        padding: 16,
        borderLeft: '1px solid #ddd',
        color: '#000',
        background: '#fff',
        overflowY: 'auto',
      }}
    >
      {!data ? (
        <div style={{ color: '#888' }}>
          ノードをクリックするとプリキュアの情報が表示されます
        </div>
      ) : (
        <>
          <h2>{data.cure}</h2>

          {/* YouTube 埋め込み */}
          {/* videoLinksプロパティとして正規化済みのデータを渡す */}
          <div className="flex justify-center">
            <TransformationPlayer videoLinks={videoLinks} />
          </div>
          <p>
            <strong>名前</strong>：{data.name}
          </p>

          <p>
            <strong>登場作品</strong>
          </p>
          <ul>
            {data.season.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <p>
            <strong>スコア</strong>
          </p>
          <ul>
            {Object.entries(data.scores).map(([k, v]) => (
              <li key={k}>
                {PERSONALITY_LABEL_MAP[k]}：{v}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
