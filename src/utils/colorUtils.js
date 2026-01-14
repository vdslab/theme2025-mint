// src/utils/colorUtils.js

// src/utils/colorUtils.js

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
