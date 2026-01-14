function extractVideoId(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }
  let videoId = null;

  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    videoId = watchMatch[1];
  } else {
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) {
      videoId = shortMatch[1];
    }
  }

  if (videoId) {
    return videoId.split('/')[0];
  }
  return null;
}

function createEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function getEmbedUrl(rawUrl) {
  if (!rawUrl) {
    return null;
  }

  const url = Array.isArray(rawUrl) ? rawUrl[0] : rawUrl;

  const videoId = extractVideoId(url);
  if (videoId) {
    return createEmbedUrl(videoId);
  }

  return null;
}
