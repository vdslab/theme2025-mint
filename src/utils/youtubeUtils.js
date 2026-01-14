function extractVideoId(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }
  // see: https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}

function createEmbedUrl(videoId) {
  // autoplay, muteなどのパラメータを追加する場合はここを修正
  return `https://www.youtube.com/embed/${videoId}`;
}

export function normalizeYouTubeLinks(rawLinks) {
  if (!rawLinks) {
    return [];
  }

  const linksArray = Array.isArray(rawLinks) ? rawLinks : [rawLinks];

  return linksArray
    .map((link, index) => {
      if (typeof link === 'string') {
        // URL文字列のみの場合
        return {
          label: `動画${index + 1}`,
          url: link,
        };
      }
      if (typeof link === 'object' && link !== null && link.url) {
        // {label, url} オブジェクトの場合
        return {
          label: link.label || `動画${index + 1}`,
          url: link.url,
        };
      }
      return null;
    })
    .filter(
      (link) =>
        link && typeof link.url === 'string' && extractVideoId(link.url),
    );
}

export function getEmbedUrl(url) {
  const videoId = extractVideoId(url);
  return videoId ? createEmbedUrl(videoId) : null;
}
