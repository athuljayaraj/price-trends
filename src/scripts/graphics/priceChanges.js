/**
 * @param data
 */
export function main () {
  if (glob.data.priceChanges.mainData === undefined) {
    return
  }

  createSlider()
  // window.onload = function () {
  //   slideOne()
  //   slideTwo()
  // }

  build()
}


/**
 *
 */
// Code for the slider inspired by https://codingartistweb.com/2021/06/double-range-slider-html-css-javascript/
function createSlider () {
  const controls = d3.select('#controls2')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.innerHeight + glob.sizes.vizSvgSizes.margin.top})`)
    .attr('width', `${glob.sizes.vizSvgSizes.innerWidth}`)
    .attr('height', 50)
    .attr('position', 'relative')
    .append('div')
    .attr('class', 'slider-container')

  controls
    .append('div').attr('class', 'slider-track')
  controls.append('input')
    .attr('type', 'range')
    .attr('min', 0)
    .attr('max', glob.sizes.vizSvgSizes.innerWidth)
    .attr('value', 30)
    .attr('id', 'slider-1')
    .on('change', () => {
      slideOne()
      reBuild()
    })

  controls.append('input')
    .attr('type', 'range')
    .attr('min', 0)
    .attr('max', glob.sizes.vizSvgSizes.innerWidth)
    .attr('value', 70)
    .attr('id', 'slider-2')
    .on('change', () => {
      slideTwo()
      reBuild()
    })
}
/**
 *
 */
function reBuild () {
  d3.select('#vizualization-svg2')
    .selectAll('*')
    .remove()
  build()
}

/**
 *
 */
// Code taken from https://codingartistweb.com/2021/06/double-range-slider-html-css-javascript/
function slideOne () {
  const sliderOne = document.getElementById('slider-1')
  const sliderTwo = document.getElementById('slider-2')
  const minGap = 0
  if (sliderTwo.value - sliderOne.value <= minGap) {
    sliderOne.value = sliderTwo.value - minGap
  }
  fillColor()
}

/**
 *
 */
// Code taken from https://codingartistweb.com/2021/06/double-range-slider-html-css-javascript/
function slideTwo () {
  const sliderOne = document.getElementById('slider-1')
  const sliderTwo = document.getElementById('slider-2')
  const minGap = 1
  if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
    sliderTwo.value = parseInt(sliderOne.value) + minGap
  }
  fillColor()
}

/**
 *
 */
// Code taken from https://codingartistweb.com/2021/06/double-range-slider-html-css-javascript/
function fillColor () {
  const sliderOne = document.getElementById('slider-1')
  const sliderTwo = document.getElementById('slider-2')
  const sliderTrack = document.querySelector('.slider-track')
  const sliderMaxValue = document.getElementById('slider-1').max
  const percent1 = (sliderOne.value / sliderMaxValue) * 100
  const percent2 = (sliderTwo.value / sliderMaxValue) * 100
  sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`
}
/**
 *
 */
function build () {
  const sliderOne = document.getElementById('slider-1')
  const sliderTwo = document.getElementById('slider-2')

  // Create the x Scale
  const xDomain = d3.extent(d3.map(glob.data.priceChanges.mainData, d => {
    return Date.parse(d.date)
  }))
  const xScale = d3.scaleTime().domain(xDomain).range([0, glob.sizes.vizSvgSizes.innerWidth])

  // // Slider scale
  // const sliderScale = d3.scaleTime().domain(xDomain).range([0, glob.sizes.vizSvgSizes.innerWidth])

  // Convert slider values to dates
  const startDate = xScale.invert(sliderOne.value)
  const endDate = xScale.invert(sliderTwo.value)

  // Tick labels
  const startDateLabel = startDate.toLocaleDateString('fr-CA', { year: 'numeric', month: 'long' })
  const endDateLabel = endDate.toLocaleDateString('fr-CA', { year: 'numeric', month: 'long' })
  const tickLabels = [startDateLabel, endDateLabel]

  // Filter data to only get data for the start and end dates
  const data = glob.data.priceChanges.mainData.filter(d => {
    const dateToString = new Date(Date.parse(d.date)).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long' })
    return dateToString.localeCompare(startDateLabel) === 0 || dateToString.localeCompare(endDateLabel) === 0
  })

  // Create the y Scale
  const yDomain = d3.extent(d3.map(data, d => d.price))
  const yScale = d3.scaleLog().domain(yDomain).range([glob.sizes.vizSvgSizes.innerHeight, 0])

  // Create axes
  const xAxis = d3.axisTop(xScale).tickSize(-glob.sizes.vizSvgSizes.innerHeight).tickValues([startDate, endDate]).tickFormat((d, i) => tickLabels[i])
  const sliderAxis = d3.axisBottom(xScale).ticks(3).tickFormat((d, i) => {
    console.log(d)
    return d.toLocaleDateString('fr-CA', { year: 'numeric', month: 'long' })
  })
  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.format('.2f'))

  const svg = d3.select('#vizualization-svg2')

  // Plot axis
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.margin.top})`)
    .call(xAxis)
    .call(g => g.select('.domain').remove())

  svg.append('g')
    .attr('class', 'slider-axis')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.innerHeight + glob.sizes.vizSvgSizes.margin.top})`)
    .call(sliderAxis)

  svg.append('g')
    .attr('class', 'y axis1')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left + xScale(startDate)}, ${glob.sizes.vizSvgSizes.margin.top})`)
    .call(yAxis)
    .call(g => g.select('.domain').remove())

  // Group data by product
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
        price: d.price
      }]
    }
  })

  const newData = []
  for (const p in groupData) {
    if (groupData[p].length === 2) {
      newData.push({
        product: p,
        values: groupData[p]
      })
    }
  }

  // Select 3 biggest and 3 smallest changes
  newData.sort((product1, product2) => {
    const change = Math.abs(product1.values[0].price - product1.values[1].price) - Math.abs(product2.values[0].price - product2.values[1].price)
    return change
  })
  const selectedData = [newData[0], newData[1], newData[2], newData[newData.length - 3], newData[newData.length - 2], newData[newData.length - 1]]

  // Create line generator
  const line = d3.line()
    .x(d => xScale(Date.parse(d.date)))
    .y(d => yScale(d.price))
    .curve(d3.curveCatmullRom.alpha(0.5))

  // Create line plots and tooltip
  const lineGroup = svg.append('g')
    .attr('transform', `translate(${glob.sizes.vizSvgSizes.margin.left}, ${glob.sizes.vizSvgSizes.margin.top})`)

  selectedData.forEach(function (product) {
    lineGroup.append('path')
      .attr('class', 'curve')
      .datum(product.values)
      .attr('d', line)
      .attr('stroke', 'black')
      .attr('stroke-width', '2')
      .attr('fill', 'none')
      .on('mouseenter', function (d) {
        d3.select(this)
          .attr('stroke', 'red')
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
          .html(`<strong>Produit: ${product.product}<br/> 
                  Prix en ${d.map(a => a.date)[0]}: ${d.map(a => a.price)[0]}<br/> 
                  Prix en ${d.map(a => a.date)[1]}: ${d.map(a => a.price)[1]}
                  </strong>`)
      })
      .on('mouseleave', function (d) {
        d3.select(this)
          .attr('stroke', 'black')
          .attr('stroke-width', '2')
        d3.select('#tooltip')
          .remove()
      }
      )
  })
}
