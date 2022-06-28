// Code taken from https://codingartistweb.com/2021/06/double-range-slider-html-css-javascript/
/**
 * @param sliderId1
 * @param sliderId2
 * @param updateGraph
 */
export function slideOne (sliderId1, sliderId2, sliderTrackClass, updateGraph) {
  const sliderOne = d3.select(sliderId1).node()
  const sliderTwo = d3.select(sliderId2).node()
  const minGap = 0
  if (sliderTwo.value - sliderOne.value <= minGap) {
    sliderOne.value = sliderTwo.value - minGap
  }
  fillColor(sliderId1, sliderId2, sliderTrackClass)
  updateGraph()
}

/**
 * @param sliderId1
 * @param sliderId2
 * @param updateGraph
 */
// Code taken from https://codingartistweb.com/2021/06/double-range-slider-html-css-javascript/
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
 * @param sliderId1
 * @param sliderId2
 * @param sliderTrackClass
 */
// Code taken from https://codingartistweb.com/2021/06/double-range-slider-html-css-javascript/
export function fillColor (sliderId1, sliderId2, sliderTrackClass) {
  const sliderOne = d3.select(sliderId1).node()
  const sliderTwo = d3.select(sliderId2).node()
  const sliderTrack = d3.select(sliderTrackClass).node()
  const sliderMaxValue = sliderOne.max
  const percent1 = (sliderOne.value / sliderMaxValue) * 100
  const percent2 = (sliderTwo.value / sliderMaxValue) * 100
  sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , var(--front) ${percent1}% , var(--front) ${percent2}%, #dadae5 ${percent2}%)`
}
