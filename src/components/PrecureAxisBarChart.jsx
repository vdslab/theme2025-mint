import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function PrecureAxisBarChart({ data, metric }) {
  const ref = useRef(null);

  useEffect(() => {
    const width = 900;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 100, left: 40 };

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const values = data.map((d) => ({
      name: d.name,
      value: d.axes7[metric],
    }));

    const x = d3
      .scaleBand()
      .domain(values.map((d) => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, 10])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .selectAll("rect")
      .data(values)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.value))
      .attr("fill", "#facc15");

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues([]));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    return () => {
      d3.select(ref.current).selectAll("*").remove();
    };
  }, [data, metric]);

  return <div ref={ref} />;
}
