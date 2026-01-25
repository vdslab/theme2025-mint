import TransformationPlayer from './TransformationPlayer';
import { SEASON_LABELS } from '../constants/season_labels';
import { PERSONALITY_METRICS } from '../constants/personality_metrics';
import { normalizeYouTubeLinks } from '../utils/youtubeUtils';

export default function DetailPanel({ data }) {
  const SEASON_LABEL_MAP = Object.fromEntries(
    SEASON_LABELS.map(({ key, label }) => [key, label]),
  );

  const PERSONALITY_LABEL_MAP = Object.fromEntries(
    PERSONALITY_METRICS.map(({ key, label }) => [key, label]),
  );

  const videoLinks = data ? normalizeYouTubeLinks(data.YouTube) : [];

  const styles = {
    panel: {
      padding: 16,
      borderLeft: '1px solid #e5e7eb',
      color: '#111827',
      background: '#fff',
      overflowY: 'auto',
      height: '100%',
    },
    empty: {
      color: '#6b7280',
      lineHeight: 1.6,
    },
    header: {
      margin: 0,
      fontSize: 18,
      fontWeight: 700,
      lineHeight: 1.2,
    },
    sub: {
      margin: '6px 0 0',
      color: '#6b7280',
      fontSize: 13,
    },
    card: {
      marginTop: 12,
      padding: 12,
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      background: '#ffffff',
    },
    sectionTitle: {
      margin: '0 0 8px',
      fontSize: 13,
      fontWeight: 700,
      color: '#374151',
      letterSpacing: 0.2,
    },
    list: {
      margin: 0,
      paddingLeft: 18,
      color: '#111827',
      lineHeight: 1.7,
    },
    scoreList: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
    },
    scoreItem: {
      padding: '8px 10px',
      border: '1px solid #eef2f7',
      borderRadius: 10,
      background: '#f9fafb',
      display: 'flex',
      justifyContent: 'space-between',
      gap: 10,
      fontSize: 13,
    },
    scoreKey: {
      color: '#374151',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    scoreVal: {
      fontWeight: 700,
      color: '#111827',
    },
    playerWrap: {
      marginTop: 12,
      display: 'flex',
      justifyContent: 'center',
    },
  };

  return (
    <div style={styles.panel}>
      {!data ? (
        <div style={styles.empty}>
          ノードをクリックするとプリキュアの情報が表示されます
        </div>
      ) : (
        <>
          <h2 style={styles.header}>
            {data.url_official ? (
              <a
                href={data.url_official}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1"
              >
                {data.cure}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 13v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h6m2-2h4m0 0v4m0-4L10 14"
                  />
                </svg>
              </a>
            ) : (
              data.cure
            )}
          </h2>
          <p style={styles.sub}>{data.name}</p>

          <div style={styles.playerWrap}>
            <TransformationPlayer videoLinks={videoLinks} />
          </div>

          <div style={styles.card}>
            <p style={styles.sectionTitle}>登場作品</p>
            <ul style={styles.list}>
              {data.season.map((s, i) => (
                <li key={i}>{SEASON_LABEL_MAP[s] ?? s}</li>
              ))}
            </ul>
          </div>

          <div style={styles.card}>
            <p style={styles.sectionTitle}>スコア</p>
            <ul style={styles.scoreList}>
              {Object.entries(data.scores).map(([k, v]) => (
                <li key={k} style={styles.scoreItem}>
                  <span style={styles.scoreKey}>
                    {PERSONALITY_LABEL_MAP[k] ?? k}
                  </span>
                  <span style={styles.scoreVal}>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
