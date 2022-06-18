/**
 *
 */
export function centerSections () {
  console.log('centerSections')
  d3.selectAll('section')
    .style('margin-bottom', function () {
      const height = d3.select(this).node().getBoundingClientRect().height
      const windowHeight = window.innerHeight
      return (windowHeight / 2 - height / 2) + 'px'
    })
    .style('margin-top', function () {
      const height = d3.select(this).node().getBoundingClientRect().height
      const windowHeight = window.innerHeight
      return (windowHeight / 2 - height / 2) + 'px'
    })
}
