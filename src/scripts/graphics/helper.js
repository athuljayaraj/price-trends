/* eslint-disable no-undef */ // For the glob variable
/**
 * @param {string} divId id of the div containing the svg
 * @param {number} numStates number of window that explain how the visualization works
 * @param {string} folderName name of the folder where the html file for the help content is
 */
export function createHelper (divId, numStates, folderName) {
  d3.select('#' + divId)
    .select(function () { return this.parentNode })
    .append('div')
    .style('width', '0px')
    .style('height', '0px')
    .append('div')
    .style('position', 'relative')
    .style('right', '20px')
    .style('top', '-35px')
    .style('float', 'right')
    .attr('class', 'noselect tmp')
    .text('?')
    .style('font-size', '20px')
    .style('background-color', 'var(--front)')
    .style('color', 'white')
    .style('padding', '10px')
    .style('border-radius', '50px')
    .style('width', '43px')
    .style('display', 'inline-block')
    .style('text-align', 'center')
    .on('mouseenter', function () {
      d3.select(this)
        .style('background-color', 'var(--accent)')
    })
    .on('mouseleave', function () {
      d3.select(this)
        .style('background-color', 'var(--front)')
    })
    .on('click', function () {
      createHelp(numStates, folderName)
    })
}
/**
 * @param {int} numStates number of window that explain how the visualization works
 * @param {string} folderName name of the folder where the html file for the help content is
 */
function createHelp (numStates, folderName) {
  d3.select('#popup')
    .style('z-index', 5)
    .append('div')
    .style('z-index', -1)
    .attr('id', 'popupHelp')
    .on('click', function () {
      d3.select('#popup').selectAll('*').remove()
      d3.select('#popup')
        .style('z-index', -1)
    })
  const contentDiv = d3.select('#popup')
    .append('div')
    .attr('id', 'mainPopup')
    .style('z-index', 6)
    .append('div')
    .attr('id', 'mainPopup-content')
    .append('div')
  glob.data.seasonalTrends.popup = {
    curr: 1,
    arrowLeftVis: false,
    arrowRightVis: true
  }

  d3.text('assets/data/popup/' + folderName + '/' + glob.data.seasonalTrends.popup.curr + '.html').then(function (data) {
    contentDiv.node().innerHTML = data
  })
  d3.select('#popup')
    .append('div')
    .style('z-index', 6)
    .attr('id', 'leftArrow')
    .attr('class', glob.data.seasonalTrends.popup.arrowLeftVis ? 'arrow-left' : null)
    .on('click', function () {
      glob.data.seasonalTrends.popup.curr -= 1
      loadNext(contentDiv, numStates, folderName)
    })
  d3.select('#popup')
    .append('div')
    .style('z-index', 6)
    .attr('id', 'rightArrow')
    .attr('class', glob.data.seasonalTrends.popup.arrowRightVis ? 'arrow-right' : null)
    .on('click', function () {
      glob.data.seasonalTrends.popup.curr += 1
      loadNext(contentDiv, numStates, folderName)
    })
}
/**
 * @param {object} contentDiv d3 selection of the div that will contain the help
 * @param {int} numStates number of window that explain how the visualization works
 * @param {string} folderName name of the folder where the html file for the help content is
 */
function loadNext (contentDiv, numStates, folderName) {
  d3.text('assets/data/popup/' + folderName + '/' + glob.data.seasonalTrends.popup.curr + '.html').then(function (data) {
    contentDiv.node().innerHTML = data
    d3.select('#leftArrow')
      .attr('class', glob.data.seasonalTrends.popup.curr > 1 ? 'arrow-left' : null)
    d3.select('#rightArrow')
      .attr('class', glob.data.seasonalTrends.popup.curr < numStates ? 'arrow-right' : null)
  })
}
