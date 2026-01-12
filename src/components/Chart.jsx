import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { PRECURE_COLORS } from "../constants/colors";

export default function Chart({ data, metric }) {
  const ref = useRef(null);

  useEffect(() => {
    const size = 900;

    const ringInner = 300;
    const ringOuter = 340;

    const barInner = 350;
    const barOuterMax = 450;

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", size)
      .attr("height", size)
      .append("g")
      .attr("transform", `translate(${size / 2}, ${size / 2})`);

    /* =====================
       Color Ring
    ===================== */

    const angleStep = (2 * Math.PI) / PRECURE_COLORS.length;

    const ringArc = d3
      .arc()
      .innerRadius(ringInner)
      .outerRadius(ringOuter)
      .startAngle((_, i) => i * angleStep)
      .endAngle((_, i) => (i + 1) * angleStep);

    svg
      .selectAll(".color-ring")
      .data(PRECURE_COLORS)
      .enter()
      .append("path")
      .attr("class", "color-ring")
      .attr("d", ringArc)
      .attr("fill", (d) => d);

    /* =====================
       Radial Bars（外側）
    ===================== */

    const angle = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, 2 * Math.PI])
      .padding(0.08);

    const radius = d3
      .scaleLinear()
      .domain([0, 10])
      .range([barInner, barOuterMax]);

    const barArc = d3
      .arc()
      .innerRadius(barInner)
      .outerRadius((d) => radius(d.scores[metric]))
      .startAngle((d) => angle(d.name))
      .endAngle((d) => angle(d.name) + angle.bandwidth());

    svg
      .selectAll(".radial-bar")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "radial-bar")
      .attr("d", barArc)
      .attr("fill", "#facc15")
      .attr("opacity", 0.9);

    return () => {
      d3.select(ref.current).selectAll("*").remove();
    };
  }, [data, metric]);

  return <div ref={ref} />;
}
