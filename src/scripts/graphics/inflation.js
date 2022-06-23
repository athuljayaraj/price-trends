/**
 *
 */
export function main () {
  const data = glob.data.inflation
  // main svg
  const svg = d3.select('#vizualization-svgInfl')
  // Create scales
  const xScale = d3.scaleTime()
    .domain([data.minX, data.maxX])
    .range([0, glob.sizes.vizSvgSizes.innerWidth])
  const yScale = d3.scaleLinear()
    .domain([data.minY, data.maxY])
    .range([glob.sizes.vizSvgSizes.innerHeight, 0])
  const colorScale = d3.scaleOrdinal()
    .domain([0, 1, 2])
    .range(['black', 'green', 'red'])
  // Creates groups
  svg.append('g')
    .call(d3.axisBottom(xScale))
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left},${glob.sizes.vizSvgSizes.height - glob.sizes.vizSvgSizes.margin.bottom})`)
  svg.append('g')
    .call(d3.axisLeft(yScale))
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left},${glob.sizes.vizSvgSizes.margin.top})`)
  // plot curves
  const curves = svg.append('g')
    .attr('id', 'curves')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.margin.top})`)
  const opacityFunc = category => category === 0 ? 0.5 : 1
  data.data.forEach(function (productObj) {
    curves
      .append('path')
      .datum(productObj.data)
      .attr('d', d3.line()
        .x(function (e) { return xScale(e.date) })
        .y(function (e) { return yScale(e.value) })
      )
      .attr('stroke', colorScale(productObj.category))
      .attr('stroke-width', '2')
      .attr('fill', 'none')
      .attr('opacity', opacityFunc(productObj.category))
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
          .html(`<strong>${d.map(x=>x.product)[0]}</strong>`)
      })
      .on('mouseleave', function (d) {
        d3.select(this)
          .attr('opacity', opacityFunc(d.category))
          .attr('stroke-width', '2')
          .attr('stroke', colorScale(productObj.category))
        d3.select('#tooltip')
          .remove()
      })
  })
}
