/* eslint-disable no-undef */
/* eslint-disable semi */

import { active } from 'd3'

/**
 *
 * @param {*} data
 */
export function main(data) {
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
  var svg = d3.select('#vizualization-smokers')
    // .append('svg')
    .attr('width', '100%')
  svg.append('text')
    .text('Price ($)')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left / 2}, ${glob.sizes.vizSvgSizes.margin.top / 2})`)
  // .attr('height', '100%')
  var chartGroup = svg
    .append('g')
    .attr('transform', 'translate(' + glob.sizes.vizSvgSizes.margin.left + ',' + glob.sizes.vizSvgSizes.margin.top + ')')

  chartGroup
    .append('path')
    .datum(data.data)
    .attr('d', d3.line()
      .x(function (d) {
        return xScale(d[0])
      })
      .y(function (d) {
        return yScale(d[1])
      }))
    .attr('fill', 'none')
    .attr('stroke', 'black')

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.innerHeight + glob.sizes.vizSvgSizes.margin.top})`)
    .call(xAxis)
  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.margin.top})`)
    .call(yAxis)

  buildNumberOfCigTextbox(chartGroup, xScale)
  buildRectangles(chartGroup, xScale)
}

/**
 *
 */
function clearRectangles() {
  d3.select('#active-smoking').remove()
}

/**
 * @param chartGroup
 * @param xScale
 */
function buildRectangles(chartGroup, xScale) {
  const sliderOne = d3.select('#slider-1Smoker').node()
  const sliderTwo = d3.select('#slider-2Smoker').node()
  const activeStartDate = mapToDate(sliderOne.value)
  const activeEndDate = mapToDate(sliderTwo.value)
  clearRectangles()

  chartGroup
    .append('rect')
    .attr('class', 'smoker-active-region')
    .attr('x', xScale(activeStartDate))
    .attr('y', 0)
    .attr('width', xScale(activeEndDate) - xScale(activeStartDate))
    .attr('height', glob.sizes.vizSvgSizes.innerHeight)
    .attr('fill', 'blue')
    .attr('stroke', '#f0f0f0')
    .attr('stroke-width', '1')
    .attr('opacity', 0.5)
    .attr('id', 'active-smoking')
}

/**
 * @param data
 * @param svg
 * @param chartGroup
 * @param xScale
 */
function buildNumberOfCigTextbox(chartGroup, xScale) {
  const control = d3.select('#cig-control')

  control
    .append('div')
    .append('p')
    .text('Number of cigarettes per day: ')
    .append('input')
    .attr('type', 'number')
    .attr('min', 0)
    .attr('id', 'cig-num')
    .on('change', function () {
      slideOne()
    })
  control
    .append('text')
    .text('Total cost in ($): 0')
    .attr('id', 'cig-cost')
  createSlider(chartGroup, xScale)
}

/**
 * @param data
 * @param startDate
 * @param endDate
 * @param numOfCigs
 */
function calculateCost(startDate, endDate) {
  const data = glob.data.smokers.data
  const NUMBER_OF_DAYS_PER_MONTH = 30
  const NUMBER_OF_CIGS_IN_DATA = 200
  const numOfCigsPerDay = document.getElementById('cig-num').value
  let partialSum = 0
  data.filter(d => d[0] >= startDate && d[0] <= endDate).forEach(element => {
    partialSum = partialSum + element[1]
  });
  console.log(partialSum)
  const totalCost = Math.round((partialSum / NUMBER_OF_CIGS_IN_DATA) * numOfCigsPerDay * NUMBER_OF_DAYS_PER_MONTH)
  d3.select('#cig-cost').text('Total cost in ($): ' + totalCost);
  return partialSum * numOfCigsPerDay;
}
/**
 * @param chartGroup
 * @param xScale
 */
function createSlider(chartGroup, xScale) {
  const controls = d3.select('#cig-control').attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.innerHeight + glob.sizes.vizSvgSizes.margin.top})`)
    .attr('width', `${glob.sizes.vizSvgSizes.innerWidth}`)
    .attr('height', 50)
    .insert('div', ':first-child')
    .attr('class', 'slider-container')
    .style('overflow', 'visible')

  controls
    .append('div').attr('class', 'slider-trackSmoker')
    .style('top', '-75px')
  controls.append('input')
    .attr('type', 'range')
    .attr('min', 0)
    .attr('max', 100)
    .attr('value', 30)
    .attr('id', 'slider-1Smoker')
    .style('top', '-75px')
    .on('change', () => {
      slideOne()
      buildRectangles(chartGroup, xScale)
    })

  controls.append('input')
    .attr('type', 'range')
    .attr('min', 0)
    .attr('max', 100)
    .attr('value', 70)
    .attr('id', 'slider-2Smoker')
    .style('top', '-75px')
    .on('change', () => {
      slideTwo()
      buildRectangles(chartGroup, xScale)
    })
}
/**
 *
 */
// Code taken from https://codingartistweb.com/2021/06/double-range-slider-html-css-javascript/
function slideOne() {
  const sliderOne = d3.select('#slider-1Smoker').node()
  const sliderTwo = d3.select('#slider-2Smoker').node()
  const minGap = 0
  if (sliderTwo.value - sliderOne.value <= minGap) {
    sliderOne.value = sliderTwo.value - minGap
  }
  fillColor()

  const startDate = mapToDate(sliderOne.value)
  const endDate = mapToDate(sliderTwo.value)
  calculateCost(startDate, endDate)
}
const mapToDate = x => new Date(Math.round((new Date(x / 100 * (glob.data.smokers.limits.maxX.getTime() - glob.data.smokers.limits.minX.getTime()) + glob.data.smokers.limits.minX.getTime())).getTime()))

/**
 *
 */
// Code taken from https://codingartistweb.com/2021/06/double-range-slider-html-css-javascript/
function slideTwo() {
  const sliderOne = d3.select('#slider-1Smoker').node()
  const sliderTwo = d3.select('#slider-2Smoker').node()
  const minGap = 1
  if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
    sliderTwo.value = parseInt(sliderOne.value) + minGap
  }
  fillColor()
  const mapToDate = x => new Date(Math.round((new Date(x / 100 * (glob.data.smokers.limits.maxX.getTime() - glob.data.smokers.limits.minX.getTime()) + glob.data.smokers.limits.minX.getTime())).getTime()))
  const startDate = mapToDate(sliderOne.value)
  const endDate = mapToDate(sliderTwo.value)
  calculateCost(startDate, endDate)
}
/**
 *
 */
// Code taken from https://codingartistweb.com/2021/06/double-range-slider-html-css-javascript/
function fillColor() {
  const sliderOne = document.getElementById('slider-1Smoker')
  const sliderTwo = document.getElementById('slider-2Smoker')
  const sliderTrack = document.querySelector('.slider-trackSmoker')
  const sliderMaxValue = document.getElementById('slider-1Smoker').max
  const percent1 = (sliderOne.value / sliderMaxValue) * 100
  const percent2 = (sliderTwo.value / sliderMaxValue) * 100
  sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`
}
