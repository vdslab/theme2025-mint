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

const rainbowColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

/**
 * Creates a style object for a node based on its themeColour.
 * @param {string|string[]} themeColour - The theme color(s) for the node.
 * @returns {object} - A CSS style object.
 */
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

  const expandedColors = colors.flatMap((c) =>
    typeof c === 'string' && c.toLowerCase() === 'rainbow' ? rainbowColors : c,
  );

  const sanitizedColors = expandedColors
    .map((c) => (typeof c === 'string' ? c.split(' ')[0].toLowerCase() : null))
    .filter((c) => c && isValidColorName(c));

  if (sanitizedColors.length === 0) {
    return defaultStyle;
  }

  if (sanitizedColors.length === 1) {
    return {
      backgroundColor: sanitizedColors[0],
      color:
        sanitizedColors[0] === 'white' ||
        sanitizedColors[0] === 'yellow' ||
        sanitizedColors[0] === 'gold'
          ? '#374151'
          : '#ffffff',
    };
  }

  if (sanitizedColors.length >= 2) {
    return {
      backgroundImage: `linear-gradient(to right, ${sanitizedColors.join(
        ', ',
      )})`,
      color: '#ffffff',
    };
  }

  return defaultStyle;
}
