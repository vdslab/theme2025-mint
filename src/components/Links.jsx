export default function Links({ nodes, links, hoveredNode, selectedNode }) {
  const activeNode = hoveredNode || selectedNode;

  if (!activeNode) {
    return null;
  }

  const activeSeasons = activeNode.season || [];
  const relatedLinks = links.filter((link) =>
    activeSeasons.includes(link.season),
  );

  const findNode = (name) => nodes.find((node) => node.name === name);

  return (
    <g>
      {relatedLinks.map((link) => {
        const sourceNode = findNode(link.source);
        const targetNode = findNode(link.target);
        if (!sourceNode || !targetNode) {
          return null;
        }
        return (
          <g key={`${link.source}-${link.target}-${link.season}`}>
            <line
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke="#a5f3fc"
              strokeWidth={7}
              strokeOpacity={0.2}
            />
            <line
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke="#22d3ee"
              strokeWidth={3}
              strokeOpacity={0.8}
            />
          </g>
        );
      })}
    </g>
  );
}
