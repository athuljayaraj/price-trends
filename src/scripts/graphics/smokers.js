import * as sliderHelper from './sliderHelper.js'
import * as helper from './helper.js'

/* eslint-disable no-undef */ // For the glob variable

/**
 * Method to build the visualization
 *
 * @param {*} data data and limits required to generate smokers visualization
 */
export function main (data) {
  helper.createHelper('vizualization-div-smokers', 3, 'smokers')

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
    .attr('width', '100%')
  svg.append('text')
    .text('Price ($)')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left / 2}, ${glob.sizes.vizSvgSizes.margin.top / 2})`)
  svg.append('text')
    .text('Date')
    .attr('x', glob.sizes.vizSvgSizes.margin.left + glob.sizes.vizSvgSizes.innerWidth / 2)
    .attr('y', glob.sizes.vizSvgSizes.margin.top + glob.sizes.vizSvgSizes.innerHeight + glob.sizes.vizSvgSizes.margin.bottom)
    .attr('text-anchor', 'middle')
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
  sliderHelper.fillColor('#slider-1Smoker', '#slider-2Smoker', '.slider-trackSmoker')
}

/**
 *
 * Clear the rectangle representing active smoking
 */
function clearRectangles () {
  d3.select('#active-smoking').remove()
}

/**
 * Build the rectangle representing active smoking
 *
 * @param {*} chartGroup chartgroup to which rectangle is appended
 * @param {*} xScale d3 scale for xAxis of the graphic
 */
function buildRectangles (chartGroup, xScale) {
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
 * Text box to enter number of cigarettes smoked
 *
 * @param {*} chartGroup chartgroup to which rectangle is appended
 * @param {*} xScale d3 scale for xAxis of the graphic
 */
function buildNumberOfCigTextbox (chartGroup, xScale) {
  const control = d3.select('#cig-control')
    .style('width', `${glob.sizes.vizSvgSizes.innerWidth}` + 'px')
    .style('padding', '30px 30px 20px 40px')
    .style('padding-left', `${glob.sizes.vizSvgSizes.margin.left}` + 'px')

  control
    .append('div')
    .append('p')
    .text('Number of cigarettes per day: ')
    .append('input')
    .attr('type', 'number')
    .attr('min', 1)
    .attr('id', 'cig-num')
    .attr('value', 13.8)
    .on('change', function () {
      sliderHelper.slideOne('#slider-1Smoker', '#slider-2Smoker', '.slider-trackSmoker', updateCost)
    })
  control
    .append('text')
    .text('Total cost: $0')
    .attr('id', 'cig-cost')
    .style('position', 'relative')
    .style('left', `${(glob.sizes.vizSvgSizes.width / 2 - 90)}` + 'px')
    .style('top', `${-(glob.sizes.vizSvgSizes.height) - 55}` + 'px')
    .style('margin-left', '-80px')
  createSlider(chartGroup, xScale)
}

/**
 * Method to update the total cost in the UI
 */
function updateCost () {
  const sliderOne = d3.select('#slider-1Smoker').node()
  const sliderTwo = d3.select('#slider-2Smoker').node()
  const numOfCigsPerDay = document.getElementById('cig-num').value
  const startDate = mapToDate(sliderOne.value)
  const endDate = mapToDate(sliderTwo.value)
  const updatedCost = calculateCost(startDate, endDate, numOfCigsPerDay)
  d3.select('#cig-cost').text('Total cost: $' + numberWithCommas(updatedCost))
}

/**
 * Method to calculate the cost
 *
 * @param {Date} startDate starting date of active smoking period
 * @param {Date} endDate end date of active smoking period
 * @param {number} numOfCigsPerDay average number of cigarettes smoked per day
 * @returns {number} totalCost
 */
function calculateCost (startDate, endDate, numOfCigsPerDay) {
  const data = glob.data.smokers.data
  const NUMBER_OF_DAYS_PER_MONTH = 30
  const NUMBER_OF_CIGS_IN_DATA = 200
  let partialSum = 0
  data.filter(d => d[0] >= startDate && d[0] <= endDate).forEach(element => {
    partialSum = partialSum + element[1]
  })
  const totalCost = Math.round((partialSum / NUMBER_OF_CIGS_IN_DATA) * numOfCigsPerDay * NUMBER_OF_DAYS_PER_MONTH)
  return totalCost
}

/**
 * Create the slider to choose active smoking period
 *
 * @param {*} chartGroup chartgroup to which rectangle is appended
 * @param {*} xScale d3 scale for xAxis of the graphic
 */
function createSlider (chartGroup, xScale) {
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
      sliderHelper.slideOne('#slider-1Smoker', '#slider-2Smoker', '.slider-trackSmoker', updateCost)
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
      sliderHelper.slideTwo('#slider-1Smoker', '#slider-2Smoker', '.slider-trackSmoker', updateCost)
      buildRectangles(chartGroup, xScale)
    })
  updateCost()
}

const mapToDate = x => new Date(Math.round((new Date(x / 100 * (glob.data.smokers.limits.maxX.getTime() - glob.data.smokers.limits.minX.getTime()) + glob.data.smokers.limits.minX.getTime())).getTime()))

const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
