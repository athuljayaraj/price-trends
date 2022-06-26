/**
 *
 */
export function main () {
  const dataGlob = glob.data.categories
  Array.from(['same_same', 'same_diff', 'diff_same']).forEach(function (category) {
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
        // Rebuild
        reBuild(category)
      })
      .selectAll('option')
      .data([...new Set(Array.from(data.map(x => x.name)))])
      .enter()
      .append('option')
      .text(d => d)
      .attr('value', d => d)
    glob.data.categories[category].current_gpe = d3.select('#selectGpe'+category).property('value')
    build(category)
  })
}
/**
 * @param category
 */
function reBuild (category) {
  const svg = d3.select('#cat' + category.charAt(0).toUpperCase() + category.slice(1))
  svg.selectAll('*').remove()
  console.log(glob.data.categories[category].current_gpe)
  build(category)
}
/**
 * @param category
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
    .attr('x',glob.sizes.vizSvgSizes.margin.left/2)
    .attr('y',glob.sizes.vizSvgSizes.margin.top/2)
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
    .attr('stroke', 'black')
    .attr('stroke-width', '2')
    .attr('fill', 'none')
    .on('mouseenter', function (d) {
      d3.select(this)
        .attr('opacity', 1)
        .attr('stroke-width', '4')
        .attr('stroke', 'orange')
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
        .attr('stroke', 'black')
      d3.select('#tooltip')
        .remove()
    })
}
