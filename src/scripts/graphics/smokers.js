/* eslint-disable no-undef */
/* eslint-disable semi */

/**
 *
 * @param {*} data
 */
export function main(data) {
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
        return xScale(d[0])
      })
      .y(function (d) {
        return yScale(d[1])
      }))
    .attr('fill', 'none')
    .attr('stroke', 'black')
  // rangeSlider(data, svg)
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.innerHeight + glob.sizes.vizSvgSizes.margin.top})`)
    .call(xAxis)
  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.margin.top})`)
    .call(yAxis)

  // var slider = document.getElementById('slider')
  // noUiSlider.create(slider, {
  //   start: [20, 80],
  //   connect: true,
  //   range: {
  //     min: 0,
  //     max: 100
  //   }
  // })
  buildNumberOfCigTextbox(data.data)
}

// eslint-disable-next-line no-multiple-empty-lines

/**
 * @param data
 * @param svg
 */
function rangeSlider(data, svg) {
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
 * @param svg
 */
function buildNumberOfCigTextbox(data, svg) {
  const control = d3.select('#cig-control')

  // var select = control
  //   .append('div')
  //   .append('select')

  var input = control
    .append('div')
    .append('input')
    .attr('type', 'number')
    .attr('id', 'cig-num')
    .on('change', function () {
      console.log(calculateCost(data))
    })

  // input.addEventListener('change', (v) => console.log(v));

  // select
  //   .on('change', function (d) {
  //     var value = d3.select(this).property('value')
  //     alert(value)
  //   })

  // select.selectAll('cig-control')
  //   .data(options)
  //   .enter()
  //   .append('option')
  //   .attr('value', function (d) {
  //     console.log(d)
  //     return d
  //   })
  //   .text(function (d) {
  //     console.log(d)

  //     return d
  //   })
}

/**
 * @param data
 * @param startDate
 * @param endDate
 * @param numOfCigs
 */
function calculateCost(data, startDate, endDate) {
  const startDate2 = new Date("03-09-2003")
  const endDate2 = new Date("03-09-2013")
  const numOfCigsPerDay = document.getElementById('cig-num').value
  let partialSum = 0
  data.filter(d => d[0] >= startDate2 && d[0] <= endDate2).forEach(element => {
    partialSum = partialSum + element[1]
  });
  return partialSum * numOfCigsPerDay;
}
