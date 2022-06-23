
var percentageVisible = {}
/**
 *
 */
export function centerSections() {
  const windowHeight = window.innerHeight
  d3.selectAll('section')
    .style('margin-bottom', function () {
      const height = d3.select(this).node().getBoundingClientRect().height
      return (windowHeight / 2 - height / 2) + 'px'
    })
    .style('margin-top', function () {
      const height = d3.select(this).node().getBoundingClientRect().height
      // log window height and elem height
      return (windowHeight / 2 - height / 2) + 'px'
    })
}
/**
 *
 */
export function mainScroll() {
  const windowHeight = window.innerHeight
  d3.selectAll('section').each(function (d, i) {
    // Check how much of the window is visible
    const section = d3.select(this)
    const sectionTop = section.node().getBoundingClientRect().top
    const sectionHeight = section.node().getBoundingClientRect().height
    const sectionBottom = sectionTop + sectionHeight
    const isVisible = sectionTop < windowHeight && sectionBottom > 0
    if (isVisible) {
      const percentage = (100, (Math.min(windowHeight, sectionBottom) - Math.max(0, sectionTop)) / sectionHeight * 100)
      percentageVisible[section.attr('id')] = percentage
    } else {
      percentageVisible[section.attr('id')] = 0
    }
  })
}
/**
 *
 */
export function svgCenter() {
  d3.select('#vizualization-div')
    .style('margin-top', function () {
      const height = d3.select(this).node().getBoundingClientRect().height
      const out = (glob.sizes.vizDivSizes.height / 2 - height / 2) + 'px'
      return out
    })
}
