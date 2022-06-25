/* eslint-disable no-undef */
/* eslint-disable semi */

/**
 *
 * @param {*} data
 */
export function main (data) {
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

  buildNumberOfCigTextbox(data.data)
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
    .attr('transform', 'translate(30,30)')

  g.call(sliderRange)
}

/**
 * @param data
 * @param svg
 */
function buildNumberOfCigTextbox (data, svg) {
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
      console.log(calculateCost(data))
      // d3.select('text.abc').text(some_other_variable);
    })
  control
    .append('text')
    .text('Total cost in ($): ' + calculateCost(data))
    .attr('id', 'cig-cost')
  const div = control
    .append('div')
  Array.from(['start', 'end']).forEach(function (id) {
    div.append('p')
      .text(id.charAt(0).toUpperCase() + id.slice(1) + ' date (YYYY-MM):')
      .style('display', 'inline-block')
    div.append('input')
      .attr('id', id + 'DateSmoke')
      .style('display', 'inline-block')
  })
  div.append('button')
    .text('Compute')
    .style('margin', '10px')
    .on('click', function () {
      const regex_text = x => (/^[0-9]{4}-[0-9]{2}$/).test(x)
      if (!regex_text(d3.select('#startDateSmoke').node().value)) {
        return
      }
      if (!regex_text(d3.select('#endDateSmoke').node().value)) {
        return
      }
      const startDate = new Date(Date.parse(d3.select('#startDateSmoke').node().value))
      const endDate = new Date(Date.parse(d3.select('#endDateSmoke').node().value))
      if (endDate.getTime() <= startDate.getTime()) {
        return
      }
      calculateCost(data, startDate, endDate)
    })
}

/**
 * @param data
 * @param startDate
 * @param endDate
 * @param numOfCigs
 */
function calculateCost (data, startDate, endDate) {
  const NUMBER_OF_DAYS_PER_MONTH = 30
  const NUMBER_OF_CIGS_IN_DATA = 200
  const numOfCigsPerDay = document.getElementById('cig-num').value
  let partialSum = 0
  data.filter(d => d[0] >= startDate && d[0] <= endDate).forEach(element => {
    partialSum = partialSum + element[1]
  });
  const totalCost = Math.round((partialSum / NUMBER_OF_CIGS_IN_DATA) * numOfCigsPerDay * NUMBER_OF_DAYS_PER_MONTH)
  d3.select('#cig-cost').text('Total cost in ($): ' + totalCost);
  return partialSum * numOfCigsPerDay;
}
