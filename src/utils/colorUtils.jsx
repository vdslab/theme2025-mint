import * as d3 from 'd3';
import { PERSONALITY_METRICS } from '../constants/personality_metrics';

const metricColorScale = d3
  .scaleOrdinal()
  .domain(PERSONALITY_METRICS.map((m) => m.key))
  .range(d3.schemeCategory10);

export function getMetricColor(metric) {
  return metricColorScale(metric);
}

// List of valid CSS color names
const validColors = [
  'black',
  'white',
  'pink',
  'blue',
  'yellow',
  'red',
  'green',
  'purple',
  'orange',
  'gold',
  'silver',
  'brown',
  'gray',
  'cyan',
  'magenta',
  'lime',
];

/**
 * Checks if a given string is a valid, simple CSS color name.
 * @param {string} color - The color string to validate.
 * @returns {boolean} - True if the color is a valid simple name.
 */
function isValidColorName(color) {
  return typeof color === 'string' && validColors.includes(color.toLowerCase());
}

const rainbowRepresentativeColor = '#8b00ff'; // DarkViolet

function getRepresentativeColor(color) {
  if (typeof color !== 'string') return null;
  const lowerColor = color.toLowerCase();
  if (lowerColor === 'rainbow') {
    return rainbowRepresentativeColor;
  }
  const sanitized = lowerColor.split(' ')[0];
  return isValidColorName(sanitized) ? sanitized : null;
}

export function getBarColor(themeColour) {
  const defaultColor = '#9ca3af'; // gray-400

  if (
    !themeColour ||
    (Array.isArray(themeColour) && themeColour.length === 0)
  ) {
    return defaultColor;
  }

  const colors = Array.isArray(themeColour) ? themeColour : [themeColour];
  const representativeColor = getRepresentativeColor(colors[0]);

  return representativeColor || defaultColor;
}

// SVG 対応した関数
export function getNodeFill(themeColour) {
  const defaultColor = '#9ca3af';

  if (!themeColour) return defaultColor;

  const colors = Array.isArray(themeColour) ? themeColour : [themeColour];

  const rep = colors.map(getRepresentativeColor).filter(Boolean);

  if (rep.length === 0) return defaultColor;

  return rep[0];
}

export function getNodeStyle(themeColour) {
  const defaultStyle = {
    backgroundColor: '#9ca3af', // gray-400
    color: '#ffffff',
  };

  if (
    !themeColour ||
    (Array.isArray(themeColour) && themeColour.length === 0)
  ) {
    return defaultStyle;
  }

  const colors = Array.isArray(themeColour) ? themeColour : [themeColour];

  if (
    colors.length === 1 &&
    typeof colors[0] === 'string' &&
    colors[0].toLowerCase() === 'rainbow'
  ) {
    return {
      backgroundImage:
        'linear-gradient(to right, red, orange, yellow, green, blue, purple)',
      color: '#ffffff',
    };
  }

  const representativeColors = colors
    .map(getRepresentativeColor)
    .filter(Boolean);

  if (representativeColors.length === 0) {
    return defaultStyle;
  }

  if (representativeColors.length >= 2) {
    const c1 = representativeColors[0];
    const c2 = representativeColors[1];
    return {
      backgroundImage: `linear-gradient(90deg, ${c1} 0%, ${c1} 60%, ${c2} 95%, ${c2} 100%)`,
      color: '#ffffff',
      textShadow: '0 0 3px rgba(0, 0, 0, 0.7)',
    };
  }

  if (representativeColors.length === 1) {
    const color = representativeColors[0];
    return {
      backgroundColor: color,
      color:
        color === 'white' || color === 'yellow' || color === 'gold'
          ? '#374151'
          : '#ffffff',
    };
  }

  return defaultStyle;
}

export function getNodeGradientDefinition(themeColour) {
  const defaultColor = '#9ca3af';
  const colors = Array.isArray(themeColour) ? themeColour : [themeColour];

  // rainbow 特別扱い（等間隔）
  if (
    colors.length === 1 &&
    typeof colors[0] === 'string' &&
    colors[0].toLowerCase() === 'rainbow'
  ) {
    const rainbowColors = [
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'indigo',
      'violet',
    ];
    return rainbowColors.map((color, i) => (
      <stop
        key={color}
        offset={`${(i / (rainbowColors.length - 1)) * 100}%`}
        stopColor={color}
      />
    ));
  }

  const representativeColors = colors
    .map(getRepresentativeColor)
    .filter(Boolean);

  if (representativeColors.length === 2) {
    const [c1, c2] = representativeColors;
    return (
      <>
        <stop key={`${c1}-0`} offset="0%" stopColor={c1} />
        <stop key={`${c1}-50`} offset="50%" stopColor={c1} />
        <stop key={`${c2}-100`} offset="100%" stopColor={c2} />
      </>
    );
  }

  // 3色以上: 等間隔
  if (representativeColors.length >= 3) {
    return representativeColors.map((color, i) => (
      <stop
        key={color + i}
        offset={`${(i / (representativeColors.length - 1)) * 100}%`}
        stopColor={color}
      />
    ));
  }

  // 単色/不明: fallback
  return (
    <stop
      key="single"
      offset="0%"
      stopColor={representativeColors[0] || defaultColor}
    />
  );
}

const COLOR_ORDER_MAP = {
  Pink: 0,
  Red: 1,
  Orange: 2,
  Yellow: 3,
  Green: 4,
  Blue: 5,
  Purple: 6,
  Black: 7,
  White: 8,
  Rainbow: 9,
  Unknown: 10,
};

// 色名の正規化関数
function normalizeColorName(colorStr) {
  if (typeof colorStr !== 'string') return '';
  return colorStr
    .toLowerCase()
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0),
    )
    .replace(/[\s-]/g, '')
    .replace(/^cure/, '');
}

// 主要な色カテゴリを決定する関数
export function getPrimaryColorCategory(themeColour) {
  const rawColors = Array.isArray(themeColour)
    ? themeColour
    : themeColour
      ? [themeColour]
      : [];
  if (rawColors.length === 0) return 'Unknown';

  const firstRaw = rawColors[0];
  const normalized = normalizeColorName(firstRaw);

  if (normalized.includes('pink') || normalized.includes('magenta'))
    return 'Pink';
  if (normalized.includes('red')) return 'Red';
  if (normalized.includes('orange')) return 'Orange';
  if (normalized.includes('yellow') || normalized.includes('gold'))
    return 'Yellow';
  if (normalized.includes('green')) return 'Green';
  if (
    normalized.includes('blue') ||
    normalized.includes('aqua') ||
    normalized.includes('cyan')
  )
    return 'Blue';
  if (
    normalized.includes('purple') ||
    normalized.includes('violet') ||
    normalized.includes('lavender')
  )
    return 'Purple';
  if (normalized.includes('black')) return 'Black';
  if (normalized.includes('white') || normalized.includes('silver'))
    return 'White';
  if (normalized.includes('rainbow')) return 'Rainbow';

  return 'Unknown';
}

export function createColorSorter() {
  const cache = new Map();

  return (a, b) => {
    if (!cache.has(a.name)) {
      const categoryA = getPrimaryColorCategory(a.themeColour);
      const orderIndexA = COLOR_ORDER_MAP[categoryA];
      const subKeyA =
        (Array.isArray(a.themeColour) ? a.themeColour[0] : a.themeColour) || '';
      cache.set(a.name, {
        category: categoryA,
        orderIndex: orderIndexA,
        subKey: subKeyA,
      });
    }
    if (!cache.has(b.name)) {
      const categoryB = getPrimaryColorCategory(b.themeColour);
      const orderIndexB = COLOR_ORDER_MAP[categoryB];
      const subKeyB =
        (Array.isArray(b.themeColour) ? b.themeColour[0] : b.themeColour) || '';
      cache.set(b.name, {
        category: categoryB,
        orderIndex: orderIndexB,
        subKey: subKeyB,
      });
    }

    const { orderIndex: orderA, subKey: subKeyA } = cache.get(a.name);
    const { orderIndex: orderB, subKey: subKeyB } = cache.get(b.name);

    if (orderA !== orderB) return orderA - orderB;
    return subKeyA.localeCompare(subKeyB);
  };
}
