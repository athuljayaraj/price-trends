import * as helper from './helper.js'
/* eslint-disable no-undef */ // For the glob variable
/**
 * Method to build the visualization
 */
export function main() {
  if (glob.data.seasonalTrends.mainData === undefined) {
    return
  }
  helper.createHelper('vizualization-div1', 3, 'seasons')
  const controls = d3.select('#controls1')
  controls
    .append('p')
    .text('Products')
    .style('display', 'inline-block')

  controls
    .append('select')
    .attr('id', 'selectProduct')
    .on('change', function () {
      glob.data.seasonalTrends.current_selection = d3.select('#selectProduct').property('value')
      reBuild()
    })
    .selectAll('option')
    .data(glob.data.seasonalTrends.selectedProd)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', function (d) { return d })
  glob.data.seasonalTrends.current_selection = d3.select('#selectProduct').property('value')
  build()
}
/**
 * Refresh the elements on the visualization
 */
function reBuild() {
  d3.select('#vizualization-svg1')
    .selectAll('*')
    .remove()
  build()
}
/**
 * Build the graphic
 */
function build() {
  const data = glob.data.seasonalTrends.mainData.filter(d => d.name === glob.data.seasonalTrends.current_selection)[0]
  const svg = d3.select('#vizualization-svg1')
  // Create scales
  const xScale = d3.scaleTime()
    .domain([data.minX, data.maxX])
    .range([0, glob.sizes.vizSvgSizes.innerWidth])
  const yScale = d3.scaleLinear()
    .domain([data.minY, data.maxY])
    .range([glob.sizes.vizSvgSizes.innerHeight, 0])

  // Create axes
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat('%b'))
  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.format('.2f'))
  // Adding seasons rects
  const seasons = [
    {
      name: 'Winter',
      start: new Date(1995, 0, 1),
      end: new Date(1995, 2, 20)
    },
    {
      name: 'Spring',
      start: new Date(1995, 2, 20),
      end: new Date(1995, 5, 21)
    },
    {
      name: 'Summer',
      start: new Date(1995, 5, 21),
      end: new Date(1995, 8, 22)
    },
    {
      name: 'Fall',
      start: new Date(1995, 8, 22),
      end: new Date(1995, 11, 1)
    }
  ]
  const seasonsScale = d3.scaleOrdinal()
    .domain([...new Set(Array.from(seasons.map(d => d.name)))])
    .range(['blue', 'lightgreen', 'green', 'orange'])
  const container = svg.append('g')
    .attr('id', 'seasons-container')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.margin.top})`)
  container.append('rect')
    .attr('width', glob.sizes.vizSvgSizes.innerWidth)
    .attr('height', glob.sizes.vizSvgSizes.innerHeight)
    .attr('fill', 'white')
  container.selectAll('.seasons')
    .data(seasons)
    .enter()
    .append('rect')
    .attr('class', 'season')
    .attr('x', season => xScale(season.start))
    .attr('y', 0)
    .attr('width', season => xScale(season.end) - xScale(season.start))
    .attr('height', glob.sizes.vizSvgSizes.innerHeight)
    .attr('fill', season => seasonsScale(season.name))
    .attr('stroke', '#f0f0f0')
    .attr('stroke-width', '1')
    .attr('opacity', 0.5)
    .attr('id', season => season.name)
    .on('mouseenter', function (season) {
      d3.select(this)
        .attr('opacity', 0.75)
      const svgInfos = d3.select('#vizualization-div1').node().getBoundingClientRect()
      const middleX = svgInfos.left +
        glob.sizes.vizSvgSizes.margin.left +
        xScale(season.start) + (xScale(season.end) - xScale(season.start)) / 2
      const marginControls = 70
      const middleY = 1500
      const divTooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('background', 'white')
        .style('padding', '10px')
        .style('top', middleY + 'px')
        .style('background', 'transparent')
        .style('text-align', 'center')
      divTooltip.append('p')
        .text(season.name)
        .style('background', 'transparent')
      divTooltip.append('img')
        .attr('src', 'assets/images/' + season.name.toLocaleLowerCase() + '.png')
        .style('width', '25px')
        .style('background', 'transparent')
      d3.select('#tooltip')
        .style('left', function () {
          const offset = d3.select(this).node().getBoundingClientRect().width / 2
          return (offset + middleX) + 'px'
        }
        )
        .style('top', function () {
          return (middleY+100) + 'px'
        })
    })
    .on('mouseleave', function (season) {
      d3.select(this)
        .attr('opacity', 0.5)
      d3.select('#tooltip')
        .remove()
    })
  // Create groups and plot axis
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.innerHeight + glob.sizes.vizSvgSizes.margin.top})`)
    .call(xAxis)
  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.margin.top})`)
    .call(yAxis)
  svg.append('text')
    .text('Price ($)')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left / 2}, ${glob.sizes.vizSvgSizes.margin.top / 2})`)
  svg.append('text')
    .text('Month of the year')
    .style('text-anchor', 'middle')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left + glob.sizes.vizSvgSizes.innerWidth / 2}, ${glob.sizes.vizSvgSizes.margin.top + glob.sizes.vizSvgSizes.innerHeight + glob.sizes.vizSvgSizes.margin.bottom / 5 * 4})`)
  // Create line plots
  const lineGroup = svg.append('g')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.margin.top})`)

  const scatterGroup = svg.append('g')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.margin.top})`)
  data.values.forEach(function (dataYear) {
    lineGroup.append('path')
      .attr('class', 'curve')
      .datum(dataYear)
      .attr('d', d3.line()
        .x(function (e) { return xScale(e.date) })
        .y(function (e) { return yScale(e.value) })
      )
      .attr('stroke', 'var(--front)')
      .attr('stroke-width', '2')
      .attr('fill', 'none')
      .on('mouseenter', function (d) {
        d3.select(this)
          .attr('stroke', 'var(--accent)')
          .attr('stroke-width', '4')
        d3.selectAll('.scatterSeasons')
          .filter(e => { return d[0].originalYear === e.originalYear })
          .attr('fill', 'var(--accent)')
          .attr('r', '4px')
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
          .html(`<strong>${d.map(a => a.originalYear)[0]}</strong>`)
      })
      .on('mouseleave', function (d) {
        d3.select(this)
          .attr('stroke', 'var(--front)')
          .attr('stroke-width', '2')
        d3.selectAll('.scatterSeasons')
          .attr('fill', 'var(--front)')
          .attr('r', '2px')
        d3.select('#tooltip')
          .remove()
      }
      )
    scatterGroup.append('g')
      .selectAll('.scatterSeasons')
      .data(dataYear)
      .enter()
      .append('circle')
      .attr('class', 'scatterSeasons')
      .attr('fill', 'var(--front)')
      .attr('r', '2px')
      .attr('cx', function (e) { return xScale(e.date) })
      .attr('cy', function (e) { return yScale(e.value) })
  })
}
