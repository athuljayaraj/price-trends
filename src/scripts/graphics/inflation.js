import * as helper from './helper.js'
/* eslint-disable no-undef */ // For the glob variable
/**
 * Method to build the visualization
 */
export function main () {
  glob.data.inflation.hovered_elem = null
  glob.data.inflation.selected_elem = [0, 1, 2]
  helper.createHelper('vizualization-divInfl', 3, 'inflation')
  build()
}
/**
 * Build the visualization
 */
function build () {
  const data = glob.data.inflation
  // main svg
  const svg = d3.select('#vizualization-svgInfl')
  svg.append('text')
    .text('Price monthly growth rate (%)')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left / 2}, ${glob.sizes.vizSvgSizes.margin.top / 2})`)
  svg.append('text')
    .text('Date')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left + glob.sizes.vizSvgSizes.innerWidth / 2}, ${glob.sizes.vizSvgSizes.margin.top + glob.sizes.vizSvgSizes.innerHeight + glob.sizes.vizSvgSizes.margin.bottom})`)
    .style('text-anchor', 'middle')
  // Create scales
  const xScale = d3.scaleTime()
    .domain([data.minX, data.maxX])
    .range([0, glob.sizes.vizSvgSizes.innerWidth])
  const yScale = d3.scaleLinear()
    .domain([data.minY, data.maxY])
    .range([glob.sizes.vizSvgSizes.innerHeight, 0])
  const colorScale = d3.scaleOrdinal()
    .domain([0, 1, 2])
    .range(['var(--front)', 'var(--accent2)', 'var(--controls-text)'])
  // Creates groups
  svg.append('g')
    .call(d3.axisBottom(xScale))
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left},${glob.sizes.vizSvgSizes.height - glob.sizes.vizSvgSizes.margin.bottom})`)
  svg.append('g')
    .call(d3.axisLeft(yScale))
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left},${glob.sizes.vizSvgSizes.margin.top})`)
  // add legend
  const sizes = glob.sizes.vizSvgSizes
  const gpeLegend = svg.append('g')
    .attr('transform', (d, i) => `translate(${(sizes.width - sizes.margin.left - sizes.margin.right) / 2 + sizes.margin.left},${sizes.margin.top})`)
  const gpe = gpeLegend
    .selectAll('.legendElem')
    .data([{ text: 'Inflation', category: 2 }, { text: 'Products with significant deviations from inflation', category: 1 }, { text: 'Other products', category: 0 }])
    .enter()
    .append('g')
    .attr('transform', (d, i) => `translate(0,${20 * (i + 1)})`)
  gpe.append('rect')
    .attr('class', 'legend-rect')
    .attr('width', '50px')
    .attr('height', '4px')
    .attr('transform', 'translate(0,-7)')
    .attr('fill', d => colorScale(d.category))
    .on('mouseenter', function (d) {
      glob.data.inflation.hovered_elem = d.category
      svg.selectAll('.legend-rect')
        .attr('opacity', function (e) {
          return opacityFunc(e.category)
        })
      refreshData(svg)
    })
    .on('mouseleave', function (d) {
      glob.data.inflation.hovered_elem = null
      svg.selectAll('.legend-rect')
        .attr('opacity', function (e) {
          return opacityFunc(e.category)
        })
      refreshData(svg)
    })
    .on('click', function (d) {
      if (glob.data.inflation.selected_elem.includes(d.category)) {
        glob.data.inflation.selected_elem = glob.data.inflation.selected_elem.filter(x => x !== d.category)
      } else {
        glob.data.inflation.selected_elem.push(d.category)
      }
      svg.selectAll('.legend-rect')
        .attr('opacity', function (e) {
          return opacityFunc(e.category)
        })
      refreshData(svg)
    })

  gpe.append('text')
    .attr('transform', 'translate(60,0)')
    .attr('font-size', '14px')
    .text(d => d.text)
  const widthLegend = gpeLegend.node().getBoundingClientRect().width
  gpeLegend
    .attr('transform', `translate(${(sizes.width - sizes.margin.left - sizes.margin.right - widthLegend) / 2 + sizes.margin.left},${sizes.margin.top})`)
  // plot curves

  // to move to front on hover : https://stackoverflow.com/questions/14167863/how-can-i-bring-a-circle-to-the-front-with-d3

  svg.append('g')
    .attr('id', 'curvesInfl')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.margin.top})`)
    .selectAll('.curves-graph')
    .data(data.data)
    .enter()
    .append('g')
    .attr('class', 'curves-graph')
    .append('path')
    .datum(d => d.data.filter(x => x.date > data.minX))
    .attr('d', d3.line()
      .x(function (e) { return xScale(e.date) })
      .y(function (e) { return yScale(e.value) })
    )
    .attr('stroke', d => { return colorScale(d.map(x => x.category)[0]) })
    .attr('stroke-width', '2')
    .attr('fill', 'none')
    .attr('opacity', function (d) { return d3.select(this.parentNode).data()[0].active ? 1 : 0 })
    .on('mouseenter', function (d) {
      if (d3.select(this.parentNode).data()[0].active) {
        d3.select(this.parentNode).raise()
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
      }
    })
    .on('mouseleave', function (d) {
      if (d3.select(this.parentNode).data()[0].active) {
        d3.select(this)
          .attr('opacity', d => 0.75)
          .attr('stroke-width', '2')
          .attr('stroke', colorScale(d.map(x => x.category)[0]))
        d3.select('#tooltip')
          .remove()
        d3.selectAll('.curves-graph')
          .filter(function (d) {
            return d3.select(this).data()[0].category === 2
          })
          .raise()
      }
    })
}
/**
 * @param {int} category representing one of the three categories of products (other products (0), products with significant deviations from inflation (1), inflation (2))
 * @returns {boolean} true if the category must be visible else false
 */
function checkIfCatVisible (category) {
  return (glob.data.inflation.selected_elem.includes(category) && glob.data.inflation.hovered_elem === null) || glob.data.inflation.hovered_elem === category
}
/**
 * @param {int} category representing one of the three categories of products (other products (0), products with significant deviations from inflation (1), inflation (2))
 * @returns {number} the opacity required for the legend depending if the category is visible or not
 */
function opacityFunc (category) {
  if (checkIfCatVisible(category)) {
    return 1
  } else {
    return 0.5
  }
}
/**
 * @param {object} svg d3 selection of the svg element
 */
function refreshData (svg) {
  const data = svg.selectAll('.curves-graph').data().map(function (d) {
    d.active = checkIfCatVisible(d.category)
    return d
  })
  svg.selectAll('.curves-graph')
    .data(data)
    .attr('opacity', function (d) { return d3.select(this).data()[0].active ? 0.75 : 0 })
}
