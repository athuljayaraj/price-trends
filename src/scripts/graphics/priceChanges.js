import * as sliderHelper from './sliderHelper.js'
import * as helper from './helper.js'
/**
 *
 */
export function main () {
  if (glob.data.priceChanges.mainData === undefined) {
    return
  }
  helper.createHelper('vizualization-div-priceChanges', 2, 'priceChanges')
  glob.data.priceChanges.yAxisTicksOffset = 4
  createSlider()
  build()
  sliderHelper.fillColor('#slider-1', '#slider-2', '.slider-track')
}

// Code for the slider inspired by https://codingartistweb.com/2021/06/double-range-slider-html-css-javascript/
/**
 *
 */
function createSlider () {
  const controls = d3.select('#controls3')
    .style('width', `${glob.sizes.vizSvgSizes.innerWidth}` + 'px')
    .style('padding', '30px 30px 20px 40px')
    .style('padding-left', `${glob.sizes.vizSvgSizes.margin.left}` + 'px')
    .append('div')
    .attr('class', 'slider-container')

  controls
    .append('div').attr('class', 'slider-track')
  controls.append('input')
    .attr('type', 'range')
    .attr('min', 0)
    .attr('max', 100)
    .attr('value', 30)
    .attr('id', 'slider-1')
    .on('change', () => {
      sliderHelper.slideOne('#slider-1', '#slider-2', '.slider-track', drawLines)
    })

  controls.append('input')
    .attr('type', 'range')
    .attr('min', 0)
    .attr('max', 100)
    .attr('value', 70)
    .attr('id', 'slider-2')
    .on('change', () => {
      sliderHelper.slideTwo('#slider-1', '#slider-2', '.slider-track', drawLines)
    })
}

/**
 *
 */
function build () {
  const sliderOne = d3.select('#slider-1').node()
  const sliderTwo = d3.select('#slider-2').node()

  // Create the scales
  const xDomain = d3.extent(d3.map(glob.data.priceChanges.mainData, d => {
    return Date.parse(d.date)
  }))
  const xScale = d3.scaleTime().domain(xDomain).range([0, glob.sizes.vizSvgSizes.innerWidth])
  const sliderScale = d3.scaleLinear().domain([0, 100]).range([0, glob.sizes.vizSvgSizes.innerWidth])
  const yScale = d3.scaleLog().range([glob.sizes.vizSvgSizes.innerHeight, 0])

  glob.data.priceChanges.xScale = xScale
  glob.data.priceChanges.sliderScale = sliderScale
  glob.data.priceChanges.yScale = yScale

  // Create axes
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.format('.2f'))

  // Draw
  const svg = d3.select('#vizualization-svg3')
  svg.append('text')
    .text('Price ($)')
    .attr('id', 'priceLegendChange')
  svg.append('text')
    .text('Date')
    .style('text-anchor', 'middle')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left + glob.sizes.vizSvgSizes.innerWidth / 2}, ${glob.sizes.vizSvgSizes.margin.top + glob.sizes.vizSvgSizes.innerHeight + glob.sizes.vizSvgSizes.margin.bottom})`)
  svg
    .append('path')
    .attr('id', 'secondBar')
    .datum([{ x: 0, y: yScale.domain()[0] }, { x: 0, y: yScale.domain()[1] }])
    .attr('d', d3.line()
      .x(function (a) { return a.x })
      .y(function (a) { return yScale(a.y) })
    )
    .attr('stroke', 'var(--front)')
    .attr('stroke-width', '1')
    .attr('fill', 'none')
    .attr('transform', 'translate(' + (sliderTwo.value / 100 * glob.sizes.vizSvgSizes.innerWidth + glob.sizes.vizSvgSizes.margin.left) + ',' + glob.sizes.vizSvgSizes.margin.top + ')')

  // Plot axis
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.height - glob.sizes.vizSvgSizes.margin.bottom})`)
    .call(xAxis)

  svg.append('g')
    .attr('class', 'y axis')
    .attr('id', 'axisValuePriceChange')
    .call(yAxis)

  d3.select('#axisValuePriceChange').selectAll('.tick text').nodes().forEach(function (d) {
    d3.select(d).attr('transform', `translate(0, ${-glob.data.priceChanges.yAxisTicksOffset})`)
  })

  svg.append('text')
    .attr('id', 'textStart')
    .style('text-anchor', 'middle')
  svg.append('text')
    .attr('id', 'textEnd')
    .style('text-anchor', 'middle')

  // position y axis
  d3.select('#axisValuePriceChange')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left + sliderOne.value / 100 * (glob.sizes.vizSvgSizes.innerWidth)}, ${glob.sizes.vizSvgSizes.margin.top})`)

  d3.select('#priceLegendChange')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left / 3 + sliderOne.value / 100 * (glob.sizes.vizSvgSizes.innerWidth)}, ${glob.sizes.vizSvgSizes.margin.top + glob.sizes.vizSvgSizes.innerHeight / 2}) rotate(-90)`)

  // Create line plots and tooltip
  svg.append('g')
    .attr('id', 'linesPriceChange')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.margin.top})`)
  drawLines()
}

/**
 * @returns {object} The start and end dates computed from the slider
 */
function computeStartEndDates () {
  let startDate = new Date(Math.round((new Date(d3.select('#slider-1').node().value / 100 * (glob.data.priceChanges.maxDate - glob.data.priceChanges.minDate) + glob.data.priceChanges.minDate)).getTime()))
  startDate.setDate(2)
  let endDate = new Date(Math.round((new Date(d3.select('#slider-2').node().value / 100 * (glob.data.priceChanges.maxDate - glob.data.priceChanges.minDate) + glob.data.priceChanges.minDate)).getTime()))
  endDate.setDate(2)
  startDate = startDate.toLocaleDateString('fr-CA', { year: 'numeric', month: 'numeric', day: 'numeric' })
  endDate = endDate.toLocaleDateString('fr-CA', { year: 'numeric', month: 'numeric', day: 'numeric' })

  return { startDate: startDate, endDate: endDate }
}

/**
 * @param {object[]} data  The data set to process
 * @returns {object} The data grouped by product
 */
function groupDataByProduct (data) {
  const groupData = {}
  data.forEach((d) => {
    if (d.product in groupData) {
      groupData[d.product].push({
        date: d.date,
        price: d.price

      })
    } else {
      groupData[d.product] = [{
        date: d.date,
        price: d.price,
        product: d.product
      }]
    }
  })

  return groupData
}

/**
 * @param {object} groupData  The data grouped by product
 * @returns {object[]} The data grouped by product sorted
 */
function sortGroupData (groupData) {
  const sortedData = []
  for (const p in groupData) {
    if (groupData[p].length === 2) {
      sortedData.push({
        product: p,
        values: groupData[p]
      })
    }
  }

  sortedData.sort((product1, product2) => {
    const change = Math.abs(product1.values[0].price - product1.values[1].price) - Math.abs(product2.values[0].price - product2.values[1].price)
    return change
  })

  return sortedData
}

/**
 * @returns {object[]} The information (product, date, price) of the 3 smallest and 3 greatest changes
 */
function preprocessTop6 () {
  const computedDates = computeStartEndDates()
  const startDate = computedDates.startDate
  const endDate = computedDates.endDate
  const data = glob.data.priceChanges.mainData.filter(d => {
    return d.date === startDate || d.date === endDate
  })
  const groupData = groupDataByProduct(data, startDate, endDate)

  // Select 3 biggest and 3 smallest changes
  const newData = sortGroupData(groupData)
  const top6Data = Array.from([0, 1, 2, newData.length - 3, newData.length - 2, newData.length - 1]).map(x => {
    const val = newData[x] !== undefined ? groupData[newData[x].product] : undefined
    return val
  })

  return top6Data.filter(d => {
    return d !== undefined
  })
}

/**
 *
 */
function drawLines () {
  const sliderOne = d3.select('#slider-1').node()
  const sliderTwo = d3.select('#slider-2').node()

  d3.select('#axisValuePriceChange')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left + sliderOne.value / 100 * (glob.sizes.vizSvgSizes.innerWidth)}, ${glob.sizes.vizSvgSizes.margin.top})`)
  d3.select('#priceLegendChange')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left / 3 + sliderOne.value / 100 * (glob.sizes.vizSvgSizes.innerWidth)}, ${glob.sizes.vizSvgSizes.margin.top + glob.sizes.vizSvgSizes.innerHeight / 2}) rotate(-90)`)

  d3.select('#secondBar')
    .attr('transform', `translate(${sliderTwo.value / 100 * glob.sizes.vizSvgSizes.innerWidth + glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.margin.top})`)
  d3.selectAll('.curvePriceChange').remove()

  const selectedData = preprocessTop6()
  if (selectedData.length === 0) {
    return
  }
  createCurves(selectedData)
  createToolTip()
  formatYAxesDateLabels(selectedData)
}

/**
 *
 */
function createToolTip () {
  d3.select('#linesPriceChange')
    .selectAll('.curvePriceChange')
    .on('mouseenter', function (d) {
      d3.select(this)
        .attr('stroke', 'var(--accent)')
        .attr('stroke-width', '4')
      d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('background', 'white')
        .style('padding', '10px')
        .style('border-radius', '5px')
        .style('box-shadow', '1px 1px 5px black')
        .style('left', (d3.event.pageX + glob.sizes.tooltip.offsetY) + 'px')
        .style('top', (d3.event.pageY + glob.sizes.tooltip.offsetY) + 'px')
        .html(`<strong>Product: ${d.map(a => a.product)[0]}<br/> 
                Price in ${d.map(a => a.date)[0]}: $${d.map(a => a.price)[0]}<br/> 
                Price in ${d.map(a => a.date)[1]}: $${d.map(a => a.price)[1]}
                </strong>`)
    })
    .on('mouseleave', function () {
      d3.select(this)
        .attr('stroke', 'var(--front)')
        .attr('stroke-width', '2')
      d3.select('#tooltip')
        .remove()
    }
    )
}

/**
 * @param {object[]} selectedData The information (product, date, price) of the 3 smallest and 3 greatest changes
 */
function createCurves (selectedData) {
  const xScale = glob.data.priceChanges.xScale
  const yScale = glob.data.priceChanges.yScale
  const min = d3.min(selectedData, x => d3.min(x, d => d.price))
  const max = d3.max(selectedData, x => d3.max(x, d => d.price))
  yScale.domain([min, max])
  d3.select('#linesPriceChange')
    .selectAll('.curvePriceChange')
    .data(selectedData)
    .enter()
    .append('g')
    .attr('class', 'curvePriceChange')
    .append('path')
    .datum(d => d)
    .attr('d', d3.line()
      .x(d => xScale(Date.parse(d.date)))
      .y(d => yScale(d.price))
      .curve(d3.curveCatmullRom.alpha(0.5)))
    .attr('stroke', 'var(--front)')
    .attr('stroke-width', '2')
    .attr('fill', 'none')
}

/**
 * @param {object[]} selectedData The information (product, date, price) of the 3 smallest and 3 greatest changes
 */
function formatYAxesDateLabels (selectedData) {
  const xScale = glob.data.priceChanges.xScale
  const formatDate = d => (new Date(d)).toLocaleDateString('en-CA', { year: 'numeric', month: 'long' })
  d3.select('#textStart')
    .text(formatDate(selectedData[0][0].date))
    .attr('transform', 'translate(' + (xScale(Date.parse(selectedData[0][0].date)) + glob.sizes.vizSvgSizes.margin.left) + ',' + glob.sizes.vizSvgSizes.margin.top / 2 + ')')
  d3.select('#textEnd')
    .text(formatDate(selectedData[0][1].date))
    .attr('transform', 'translate(' + (xScale(Date.parse(selectedData[0][1].date)) + glob.sizes.vizSvgSizes.margin.left) + ',' + glob.sizes.vizSvgSizes.margin.top / 2 + ')')
}
