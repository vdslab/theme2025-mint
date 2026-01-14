import { getEmbedUrl } from '../utils/youtubeUtils';

export default function TransformationPlayer({ videoUrl }) {
  const embedUrl = getEmbedUrl(videoUrl);

  if (!embedUrl) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
        <p className="text-white">No video available</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="aspect-video w-full max-w-[420px] overflow-hidden rounded-lg shadow-xl">
        <iframe
          width="100%"
          height="100%"
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Transformation Video"
        />
      </div>
    </div>
  );
}
