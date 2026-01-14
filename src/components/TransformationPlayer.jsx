import { useState, useEffect } from 'react';
import { getEmbedUrl } from '../utils/youtubeUtils';

export default function TransformationPlayer({ videoLinks = [] }) {
  const [activeUrl, setActiveUrl] = useState(null);

  useEffect(() => {
    if (videoLinks && videoLinks.length > 0) {
      setActiveUrl(videoLinks[0].url);
    } else {
      setActiveUrl(null);
    }
  }, [videoLinks]);

  const embedUrl = activeUrl ? getEmbedUrl(activeUrl) : null;

  if (!videoLinks || videoLinks.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
        <p className="text-white">No video available</p>
      </div>
    );
  }

  if (videoLinks.length === 1) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="aspect-video w-full max-w-[420px] overflow-hidden rounded-lg shadow-xl">
          <IframePlayer embedUrl={embedUrl} />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
      <div role="tablist" className="tabs tabs-boxed mb-2 bg-black/20">
        {videoLinks.map((link) => (
          <a
            key={link.label}
            role="tab"
            className={`tab ${activeUrl === link.url ? 'tab-active' : ''}`}
            onClick={() => setActiveUrl(link.url)}
            // キーボード操作用の対応
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setActiveUrl(link.url);
              }
            }}
            tabIndex={0}
          >
            {link.label}
          </a>
        ))}
      </div>
      <div className="aspect-video w-full max-w-[420px] overflow-hidden rounded-lg shadow-xl">
        <IframePlayer embedUrl={embedUrl} />
      </div>
    </div>
  );
}

function IframePlayer({ embedUrl }) {
  if (!embedUrl) return null;

  return (
    <iframe
      key={embedUrl}
      width="100%"
      height="100%"
      src={embedUrl}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Transformation Video"
      loading="lazy"
    />
  );
}
