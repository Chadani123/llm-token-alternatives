import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';

const BAR_COLOR_SELECTED = '#ff4b1f';
const BAR_COLOR_ALT = '#d9d9d9';
const TINY_THRESHOLD = 0.01; // 1%

export default function BarChart({ selectedToken, topK = 3 }) {
  const svgRef = useRef(null);

  const chartData = useMemo(() => {
    if (!selectedToken) return [];

    const limitedAlternatives = [...selectedToken.alternatives]
      .sort((a, b) => b.prob - a.prob)
      .slice(0, topK);

    return [
      {
        token: cleanToken(selectedToken.text),
        prob: selectedToken.confidence,
        isSelected: true,
      },
      ...limitedAlternatives.map((item) => ({
        token: cleanToken(item.token),
        prob: item.prob,
        isSelected: false,
      })),
    ];
  }, [selectedToken, topK]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    if (!chartData.length) return;

    const width = 760;
    const rowHeight = 54;
    const margin = { top: 8, right: 80, bottom: 8, left: 12 };
    const labelColumnWidth = 170;
    const barAreaX = labelColumnWidth + 20;
    const maxBarWidth = width - barAreaX - margin.right;
    const height = chartData.length * rowHeight + margin.top + margin.bottom;

    const maxProb = d3.max(chartData, (d) => d.prob) || 1;

    svg.attr('viewBox', `0 0 ${width} ${height}`);
    svg.attr('width', '100%');
    svg.attr('height', height);

    const x = d3.scaleLinear().domain([0, maxProb]).range([0, maxBarWidth]);

    const groups = svg
      .selectAll('g.row')
      .data(chartData)
      .join('g')
      .attr('class', 'row')
      .attr('transform', (_, index) => `translate(${margin.left}, ${index * rowHeight + margin.top})`);

    // token labels on the left
    // groups
    //   .append('text')
    //   .attr('x', 0)
    //   .attr('y', 25)
    //   .attr('fill', (d) => (d.isSelected ? '#ffffff' : '#6b7280'))
    //   .attr('font-size', 18)
    //   .attr('font-weight', 700)
    //   .text((d) => d.token);

    groups
    .append('text')
    .attr('x', 0)
    .attr('y', 25)
    .attr('fill', (d) => (d.isSelected ? '#1f2937' : '#6b7280'))
    .attr('font-size', 18)
    .attr('font-weight', (d) => (d.isSelected ? 800 : 700))
    .text((d) => d.token);

    // bars
    groups
      .append('rect')
      .attr('x', barAreaX)
      .attr('y', 4)
      .attr('height', 32)
      .attr('rx', 4)
      .attr('width', (d) => Math.max(x(d.prob), 10)) // tiny bars still visible
      .attr('fill', (d) => (d.isSelected ? BAR_COLOR_SELECTED : BAR_COLOR_ALT));

    // percent labels on right
    groups
      .append('text')
      .attr('x', (d) => barAreaX + Math.max(x(d.prob), 10) + 10)
      .attr('y', 26)
      .attr('fill', (d) => (d.isSelected ? BAR_COLOR_SELECTED : '#a3a3a3'))
      .attr('font-size', 18)
      .attr('font-weight', 700)
      .text((d) => formatPercent(d.prob));

  }, [chartData]);

  if (!selectedToken) {
    return <div className="placeholder">Click a token to see top alternatives.</div>;
  }

  return <svg ref={svgRef} className="bar-chart" aria-label="Top token alternatives chart" />;
}

function cleanToken(text) {
  return text.replace(/^"|"$/g, '');
}

function formatPercent(prob) {
  if (prob < TINY_THRESHOLD) {
    return `<${TINY_THRESHOLD * 100}%`;
  }

  const percent = prob * 100;

  if (Number.isInteger(percent)) {
    return `${percent}%`;
  }

  if (percent >= 10) {
    return `${percent.toFixed(1)}%`;
  }

  return `${percent.toFixed(2)}%`;
}
