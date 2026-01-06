import { useEffect, useRef } from "react";
import { PRECURE_COLORS } from "../constants/colors";
import * as d3 from "d3";

export default function PrecureColorRing() {
  const ref = useRef(null);

  useEffect(() => {
    const width = 800;
    const height = 800;
    const radius = Math.min(width, height) / 2;

    const data = PRECURE_COLORS;
    const segments = PRECURE_COLORS.length;
    const angleStep = (2 * Math.PI) / segments;

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const arc = d3
      .arc()
      .innerRadius(radius * 0.8)
      .outerRadius(radius)
      .startAngle((_, i) => i * angleStep)
      .endAngle((_, i) => (i + 1) * angleStep);

    svg
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) =>
        d === "rainbow" ? "url(#rainbowGradient)" : d
      );

    return () => {
      d3.select(ref.current).selectAll("*").remove();
    };
  }, []);

  return <div ref={ref}></div>;
}