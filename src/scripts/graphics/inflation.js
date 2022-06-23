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
    .attr('width', '50px')
    .attr('height', '2px')
    .attr('transform', 'translate(0,-7)')
    .attr('fill', d => colorScale(d.category))
  gpe.append('text')
    .attr('transform', 'translate(60,0)')
    .attr('font-size', '14px')
    .text(d => d.text)
  const widthLegend = gpeLegend.node().getBoundingClientRect().width
  gpeLegend
    .attr('transform', `translate(${(sizes.width - sizes.margin.left - sizes.margin.right - widthLegend) / 2 + sizes.margin.left},${sizes.margin.top})`)
  // plot curves
  const opacityFunc = category => category === 0 ? 0.5 : 1
  // to move to front on hover : https://stackoverflow.com/questions/14167863/how-can-i-bring-a-circle-to-the-front-with-d3
  d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
      this.parentNode.appendChild(this)
    })
  }
  svg.append('g')
    .attr('id', 'curvesInfl')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.margin.top})`)
    .selectAll('path')
    .data(data.data)
    .enter()
    .append('path')
    .datum(d => d.data.filter(x => x.date > data.minX))
    .attr('d', d3.line()
      .x(function (e) { return xScale(e.date) })
      .y(function (e) { return yScale(e.value) })
    )
    .attr('stroke', d => { return colorScale(d.map(x => x.category)[0]) })
    .attr('stroke-width', '2')
    .attr('fill', 'none')
    .attr('opacity', d => opacityFunc(d.map(x => x.category)[0]))
    .on('mouseenter', function (d) {
      d3.select(this).raise()
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
        .attr('opacity', opacityFunc(d.map(x => x.category)[0]))
        .attr('stroke-width', '2')
        .attr('stroke', colorScale(d.map(x => x.category)[0]))
      d3.select('#tooltip')
        .remove()
      d3.select('#vizualization-svgInfl').select('#curvesInfl').selectAll('path')
        .filter(function (d) {
          return d.map(x => x.category === 2)[0]
        })
        .attr('stroke-width', '2')
        .raise()
    })
}
