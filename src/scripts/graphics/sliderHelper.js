// Code taken and adapted from https://codingartistweb.com/2021/06/double-range-slider-html-css-javascript/
/**
 * @param {string} sliderId1 The id selector of the first slider
 * @param {string} sliderId2 The id selector of the second slider
 * @param {string} sliderTrackClass The class selector of the slider track div
 * @param {Function} updateGraph The function to update the graph
 */
export function slideOne (sliderId1, sliderId2, sliderTrackClass, updateGraph) {
  const sliderOne = d3.select(sliderId1).node()
  const sliderTwo = d3.select(sliderId2).node()
  const minGap = 1
  if (sliderTwo.value - sliderOne.value <= minGap) {
    sliderOne.value = sliderTwo.value - minGap
  }
  fillColor(sliderId1, sliderId2, sliderTrackClass)
  updateGraph()
}

/**
 * @param {string} sliderId1 The id selector of the first slider
 * @param {string} sliderId2 The id selector of the second slider
 * @param {string} sliderTrackClass The class selector of the slider track div
 * @param {Function} updateGraph The function to update the graph
 */
// Code taken and adapted from https://codingartistweb.com/2021/06/double-range-slider-html-css-javascript/
export function slideTwo (sliderId1, sliderId2, sliderTrackClass, updateGraph) {
  const sliderOne = d3.select(sliderId1).node()
  const sliderTwo = d3.select(sliderId2).node()
  const minGap = 1
  if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
    sliderTwo.value = parseInt(sliderOne.value) + minGap
  }
  fillColor(sliderId1, sliderId2, sliderTrackClass)
  updateGraph()
}

/**
 * @param {string} sliderId1 The id selector of the first slider
 * @param {string} sliderId2 The id selector of the second slider
 * @param {string} sliderTrackClass The class selector of the slider track div
 */
// Code taken and adapted from https://codingartistweb.com/2021/06/double-range-slider-html-css-javascript/
export function fillColor (sliderId1, sliderId2, sliderTrackClass) {
  const sliderOne = d3.select(sliderId1).node()
  const sliderTwo = d3.select(sliderId2).node()
  const sliderTrack = d3.select(sliderTrackClass).node()
  const sliderMaxValue = sliderOne.max
  const percent1 = (sliderOne.value / sliderMaxValue) * 100
  const percent2 = (sliderTwo.value / sliderMaxValue) * 100
  sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`
}
