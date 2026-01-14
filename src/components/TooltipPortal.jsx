import { createPortal } from 'react-dom';

export default function TooltipPortal({ content, position, visible }) {
  if (!visible) {
    return null;
  }

  const tooltipStyle = {
    position: 'fixed',
    top: `${position.y + 15}px`,
    left: `${position.x + 15}px`,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    pointerEvents: 'none',
    whiteSpace: 'pre-wrap',
    transition: 'opacity 0.2s ease-in-out',
    opacity: 1,
  };

  return createPortal(<div style={tooltipStyle}>{content}</div>, document.body);
}
