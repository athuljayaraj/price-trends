/**
 *
 */
export function centerSections() {
  console.log('centerSections')
  const windowHeight = window.innerHeight
  d3.selectAll('section')
    .style('margin-bottom', function () {
      const height = d3.select(this).node().getBoundingClientRect().height
      return (windowHeight / 2 - height / 2) + 'px'
    })
    .style('margin-top', function () {
      const height = d3.select(this).node().getBoundingClientRect().height
      return (windowHeight / 2 - height / 2) + 'px'
    })
  console.log(windowHeight)
}
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
      console.log('section', section.attr('id'), 'is visible at ' + percentage.toFixed(2) + '%')
    } else {
      console.log('section', section.attr('id'), 'is not visible')
    }
  })
}