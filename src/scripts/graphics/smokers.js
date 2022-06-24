/* eslint-disable no-undef */
/* eslint-disable semi */
import { sliderBottom } from 'd3-simple-slider';

/**
 *
 * @param {*} data
 */
export function main (data) {
  // const margin = { top: 10, right: 30, bottom: 30, left: 60 }

  const xScale = d3.scaleTime()
    .domain([data.limits.minX, data.limits.maxX])
    .range([0, glob.sizes.vizSvgSizes.innerWidth])
  const yScale = d3.scaleLinear()
    .domain([data.limits.minY, data.limits.maxY])
    .range([glob.sizes.vizSvgSizes.innerHeight, 0])

  // Create axes
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat('%Y'))
  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.format('.2f'))

  // append the svg object to the body of the page
  var svg = d3.select('#vizualization-svg2')
    // .append('svg')
    .attr('width', '100%')
  // .attr('height', '100%')
  var chartGroup = svg
    .append('g')
    .attr('transform', 'translate(' + glob.sizes.vizSvgSizes.margin.left + ',' + glob.sizes.vizSvgSizes.margin.top + ')')

  chartGroup
    .append('path')
    .datum(data.data)
    .attr('d', d3.line()
      .x(function (d) {
        return xScale(new Date(d[0]))
      })
      .y(function (d) {
        return yScale(parseFloat(d[1]))
      }))
    .attr('fill', 'none')
    .attr('stroke', 'black')
  rangeSlider(data, svg)
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.innerHeight + glob.sizes.vizSvgSizes.margin.top})`)
    .call(xAxis)
  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.margin.top})`)
    .call(yAxis)
}

// eslint-disable-next-line no-multiple-empty-lines

/**
 * @param data
 * @param svg
 */
function rangeSlider (data, svg) {
  // Range
  var sliderRange = sliderBottom()
    .min(data.limits.minX)
    .max(data.limits.maxX)
    .step(3)
    .width(900)

  const g = svg
    .append('g')
    .attr('transform', 'translate(30,30)');

  g.call(sliderRange);
}
