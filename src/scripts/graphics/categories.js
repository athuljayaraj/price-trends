import * as helper from './helper.js'
/* eslint-disable no-undef */ // For the glob variable
/**
 * Method to build the visualization
 */
export function main () {
  const dataGlob = glob.data.categories
  Array.from(['same_same', 'same_diff', 'diff_same']).forEach(function (category, i) {
    helper.createHelper('vizualization-divCat' + (i + 1), 2, 'categories' + (i + 1))
    const data = dataGlob[category]
    const controls = d3.select('#controls' + category.charAt(0).toUpperCase() + category.slice(1))
    // controls
    controls
      .append('p')
      .text('Group')
      .style('display', 'inline-block')
    controls
      .append('select')
      .attr('id', 'selectGpe' + category)
      .on('change', function () {
        glob.data.categories[category].current_gpe = d3.select(this).property('value')
        reBuild(category)
      })
      .selectAll('option')
      .data([...new Set(Array.from(data.map(x => x.name)))])
      .enter()
      .append('option')
      .text(d => d)
      .attr('value', d => d)
    glob.data.categories[category].current_gpe = d3.select('#selectGpe' + category).property('value')
    build(category)
  })
}
/**
 * @param category {string}, name of the category (same_same, same_diff or diff_same) to rebuild
 */
function reBuild (category) {
  const svg = d3.select('#cat' + category.charAt(0).toUpperCase() + category.slice(1))
  svg.selectAll('*').remove()
  build(category)
}
/**
 * @param category {string}, name of the category (same_same, same_diff or diff_same) to rebuild
 */
function build (category) {
  const data = glob.data.categories[category].filter(x => x.name === glob.data.categories[category].current_gpe)[0]
  const svg = d3.select('#cat' + category.charAt(0).toUpperCase() + category.slice(1))
  // Create scales
  const xScale = d3.scaleTime()
    .domain([data.minX, data.maxX])
    .range([0, glob.sizes.vizSvgSizes.innerWidth])
  const yScale = d3.scaleLinear()
    .domain([data.minY, data.maxY])
    .range([glob.sizes.vizSvgSizes.innerHeight, 0])

  // Create axes
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat('%Y'))
  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.format('.2f'))

  // Draw axes
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.innerHeight + glob.sizes.vizSvgSizes.margin.top})`)
    .call(xAxis)
  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.margin.top})`)
    .call(yAxis)
  // Adding y label
  svg.append('text')
    .text('Price ($)')
    .attr('x', glob.sizes.vizSvgSizes.margin.left / 2)
    .attr('y', glob.sizes.vizSvgSizes.margin.top / 2)
  svg.append('text')
    .text('Date')
    .attr('x', glob.sizes.vizSvgSizes.margin.left + glob.sizes.vizSvgSizes.innerWidth / 2)
    .attr('y', glob.sizes.vizSvgSizes.margin.top + glob.sizes.vizSvgSizes.innerHeight + glob.sizes.vizSvgSizes.margin.bottom)
    .attr('text-anchor', 'middle')
  // Draw curves
  svg.append('g')
    .attr('id', 'curvesCat')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.margin.top})`)
    .selectAll('path')
    .data(data.data)
    .enter()
    .append('path')
    .datum(d => d)
    .attr('d', d3.line()
      .x(function (e) { return xScale(e.date) })
      .y(function (e) { return yScale(e.value) })
    )
    .attr('stroke', 'var(--front)')
    .attr('stroke-width', '2')
    .attr('fill', 'none')
    .on('mouseenter', function (d) {
      d3.select(this)
        .attr('opacity', 1)
        .attr('stroke-width', '4')
        .attr('stroke', 'var(--accent)')
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
        .html(`<strong>${d.map(x => x.product)[0]}</strong>`)
    })
    .on('mouseleave', function (d) {
      d3.select(this)
        .attr('stroke-width', '2')
        .attr('stroke', 'var(--front)')
      d3.select('#tooltip')
        .remove()
    })
  svg.append('g')
    .attr('id', 'scatterCat')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.margin.top})`)
    .selectAll('g')
    .data(data.data)
    .enter()
    .append('g')
    .selectAll('circle')
    .data(d => d)
    .enter()
    .append('circle')
    .attr('cx', e => xScale(e.date))
    .attr('cy', e => yScale(e.value))
    .attr('fill', 'var(--front)')
    .attr('r', '1px')
    .attr('opacity', 0)
    .on('mouseenter', function (d) {
      d3.selectAll('#scatterCat')
        .selectAll('circle')
      d3.select(this)
        .attr('r', '4px')
        .attr('fill', 'var(--accent)')
      d3.selectAll('#curvesCat')
        .selectAll('path')
        .filter(e => d.product === e[0].product)
        .attr('stroke-width', '4')
        .attr('stroke', 'var(--accent)')
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
        .html(`<strong>${d.product}</strong>: $${d.value}`)
    })
    .on('mouseleave', function (d) {
      d3.selectAll('#scatterCat')
        .selectAll('circle')
      d3.select(this)
        .attr('r', '2px')
        .attr('fill', 'var(--front)')
      d3.selectAll('#curvesCat')
        .selectAll('path')
        .filter(e => d.product === e[0].product)
        .attr('stroke-width', '2')
        .attr('stroke', 'var(--front)')
      d3.selectAll('#curvesCat')
        .selectAll('path')
        .filter(e => d.product === e.product)
        .attr('stroke-width', '2')
        .attr('stroke', 'var(--front)')
      d3.select('#tooltip')
        .remove()
    })
}
