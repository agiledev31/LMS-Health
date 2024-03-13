import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const PieChart = ({
  data = [20, 35, 10, 15, 20],
  color = ["#7F56D9", "#9E77ED", "#B692F6", "#D6BBFB", "#EAECF0"],
}) => {
  const chartRef = useRef(null);
  useEffect(() => {
    if (chartRef.current) {
      d3.select(chartRef.current).select("svg").remove();
      const width = 250; // Width of the chart
      const height = 250; // Height of the chart
      const radius = Math.min(width, height) / 2; // Radius of the doughnut
      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);
      const arc = d3
        .arc()
        .innerRadius(radius * 0.6) // Inner radius of the doughnut
        .outerRadius(radius); // Outer radius of the doughnut
      const pie = d3
        .pie()
        .sort(null)
        .value((d) => d);
      const arcs = svg
        .selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");
      arcs
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, idx) => color[idx]);
      // Add labels if needed
      // arcs.append('text')
      //   .attr('transform', d => `translate(${arc.centroid(d)})`)
      //   .attr('text-anchor', 'middle')
      //   .text(d => d.data);

      // Attach onclick event to the arcs
      arcs.on("click", (event, d) => {
        // Event handler code to execute when the arc is clicked
        console.log("Arc clicked!", d);
      });
    }
  }, [data, color]);
  return <div ref={chartRef}></div>;
};

export default PieChart;
