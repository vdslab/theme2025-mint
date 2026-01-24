import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { PERSONALITY_METRICS } from '../constants/personality_metrics';

const StripPlot = ({ data = [], selectedCharacter, onSelectCharacter }) => {
  const svgRef = useRef(null);
  const legendRef = useRef(null);

  const margin = { top: 10, right: 20, bottom: 30, left: 100 };
  const width = 280;
  const rowHeight = 20;
  const height = Math.max(1, data.length) * rowHeight;

  useEffect(() => {
    if (!data || data.length === 0) return;

    /* ---------- util ---------- */
    const idOf = (d) => String(d?.id ?? d?.cure ?? d?.name ?? '');
    const labelOf = (d) =>
      String(d?.cure ?? d?.name ?? '').replace('キュア', '');

    const selectedCureId = selectedCharacter ? idOf(selectedCharacter) : null;
    const hasSelection = Boolean(selectedCureId);

    const safeData = data.filter((d) => idOf(d) !== '');
    const labelById = new Map(safeData.map((d) => [idOf(d), labelOf(d)]));

    /* ---------- color & symbol ---------- */
    const metricKeys = PERSONALITY_METRICS.map((m) => m.key);

    const metricColor = d3
      .scaleOrdinal()
      .domain(metricKeys)
      .range(d3.schemeTableau10.slice(0, metricKeys.length));

    const symbolTypes = [
      d3.symbolCircle,
      d3.symbolSquare,
      d3.symbolTriangle,
      d3.symbolDiamond,
      d3.symbolCross,
      d3.symbolStar,
      d3.symbolWye,
    ];

    const metricSymbol = d3
      .scaleOrdinal()
      .domain(metricKeys)
      .range(symbolTypes.slice(0, metricKeys.length));

    /* ---------- svg setup ---------- */
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = Math.max(1, safeData.length) * rowHeight;

    const chart = svg
      .attr('width', width)
      .attr('height', chartHeight + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    /* ---------- scales ---------- */
    const xScale = d3
      .scaleLinear()
      .domain([1, 10])
      .range([0, chartWidth])
      .clamp(true);

    const ids = safeData.map(idOf);
    const yScale = d3
      .scaleBand()
      .domain(ids)
      .range([0, chartHeight])
      .padding(0.1);

    /* ---------- background rows ---------- */
    chart
      .selectAll('.row-bg')
      .data(safeData, (d) => idOf(d))
      .join('rect')
      .attr('class', 'row-bg')
      .attr('x', -margin.left)
      .attr('y', (d) => yScale(idOf(d)))
      .attr('width', width)
      .attr('height', yScale.bandwidth())
      .attr('fill', (d, i) => {
        const id = idOf(d);
        if (hasSelection && id === selectedCureId) return '#fffde7';
        return i % 2 === 0 ? '#f9f9f9' : 'transparent';
      });

    /* ---------- axes ---------- */
    const xAxis = d3.axisBottom(xScale).ticks(10).tickSizeOuter(0);
    const xAxisGroup = chart
      .append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(xAxis);

    xAxisGroup.select('.domain').remove();
    xAxisGroup.selectAll('line').style('stroke', '#ccc');
    xAxisGroup
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#666');

    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((id) => labelById.get(String(id)) ?? '')
      .tickSize(0);

    const yAxisGroup = chart.append('g').call(yAxis);
    yAxisGroup.select('.domain').remove();
    yAxisGroup
      .selectAll('.tick text')
      .style('font-size', '10px')
      .style('fill', (id) =>
        hasSelection && String(id) === selectedCureId ? '#111' : '#666',
      )
      .style('font-weight', 'normal');

    /* ---------- clickable rows ---------- */
    chart
      .selectAll('.click-rect')
      .data(safeData, (d) => idOf(d))
      .join('rect')
      .attr('class', 'click-rect')
      .attr('x', -margin.left)
      .attr('y', (d) => yScale(idOf(d)))
      .attr('width', width)
      .attr('height', yScale.bandwidth())
      .attr('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('click', (_e, d) => onSelectCharacter?.(d));

    /* ---------- points ---------- */
    const pointsData = safeData.flatMap((d) => {
      const scores = d.scores ?? {};
      const cureId = idOf(d);

      return PERSONALITY_METRICS.map((metric) => ({
        cureId,
        metricKey: metric.key,
        score: scores[metric.key],
      }))
        .filter((p) => Number.isFinite(+p.score))
        .map((p) => ({ ...p, score: +p.score }));
    });

    const unselectedPoints = hasSelection
      ? pointsData.filter((p) => p.cureId !== selectedCureId)
      : [];
    const selectedPoints = hasSelection
      ? pointsData.filter((p) => p.cureId === selectedCureId)
      : pointsData;

    const drawMarks = (sel, { isSelected }) => {
      sel
        .attr(
          'd',
          d3
            .symbol()
            .type((d) => metricSymbol(d.metricKey))
            .size(isSelected ? 90 : 55),
        )
        .attr(
          'transform',
          (d) =>
            `translate(${xScale(d.score)}, ${
              yScale(d.cureId) + yScale.bandwidth() / 2
            })`,
        )
        .attr('fill', (d) => metricColor(d.metricKey))
        .attr('opacity', isSelected ? 1 : 0.35)
        .attr('stroke', isSelected ? '#111' : 'none')
        .attr('stroke-width', isSelected ? 1.0 : 0)
        .style('pointer-events', 'none');
    };

    chart
      .selectAll('.point-unselected')
      .data(unselectedPoints, (d) => `${d.cureId}-${d.metricKey}`)
      .join('path')
      .attr('class', 'point-unselected')
      .call((sel) => drawMarks(sel, { isSelected: false }));

    chart
      .selectAll('.point-selected')
      .data(selectedPoints, (d) => `${d.cureId}-${d.metricKey}`)
      .join('path')
      .attr('class', 'point-selected')
      .call((sel) => drawMarks(sel, { isSelected: true }));

    /* ---------- legend (color + symbol) ---------- */
    const legendSvg = d3.select(legendRef.current);
    legendSvg.selectAll('*').remove();

    const legendHeight = 10 + PERSONALITY_METRICS.length * 16 + 10;

    const legend = legendSvg
      .attr('width', width)
      .attr('height', legendHeight)
      .append('g')
      .attr('transform', `translate(10, 10)`);

    const legendItem = legend
      .selectAll('.legend-item')
      .data(PERSONALITY_METRICS, (d) => d.key)
      .join('g')
      .attr('class', 'legend-item')
      .attr('transform', (_d, i) => `translate(0, ${i * 16})`);

    // ★ rect の代わりに symbol を描く
    legendItem
      .append('path')
      .attr(
        'd',
        d3
          .symbol()
          .type((d) => metricSymbol(d.key))
          .size(70), // 凡例用のサイズ
      )
      .attr('transform', 'translate(6, 6)') // 左上に寄るので位置調整
      .attr('fill', (d) => metricColor(d.key))
      .attr('stroke', '#111')
      .attr('stroke-width', 0.3);

    legendItem
      .append('text')
      .attr('x', 18)
      .attr('y', 8)
      .style('font-size', '11px')
      .style('fill', '#333')
      .text((d) => d.label);
  }, [data, selectedCharacter, onSelectCharacter]);

  const legendHeight = 10 + PERSONALITY_METRICS.length * 15 + 20;

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={legendRef} />
      <div
        style={{ overflowY: 'auto', height: `calc(100vh - ${legendHeight}px)` }}
      >
        <svg ref={svgRef} />
      </div>
    </div>
  );
};

export default StripPlot;
