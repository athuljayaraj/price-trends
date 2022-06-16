
/**
 *
 */
export function scrollerMain () {
  let container = d3.select('body')
  const dispatch = d3.dispatch('active', 'progress')
  const sections = d3.selectAll('.step')
  let sectionPositions

  let currentIndex = -1
  const containerStart = 0

  /**
   *
   */
  function scroll () {
    d3.select(window)
      .on('scroll.scroller', position)
      .on('resize.scroller', resize)

    resize()

    const timer = d3.timer(function () {
      position()
      timer.stop()
    })
  }

  /**
   *
   */
  function resize () {
    sectionPositions = []
    let startPos

    sections.each(function (d, i) {
      const top = this.getBoundingClientRect().top

      if (i === 0) {
        startPos = top
      }
      sectionPositions.push(top - startPos)
    })
  }

  /**
   *
   */
  function position () {
    const pos = window.pageYOffset - 300 - containerStart
    let sectionIndex = d3.bisect(sectionPositions, pos)
    sectionIndex = Math.min(sections.size() - 1, sectionIndex)

    if (currentIndex !== sectionIndex) {
      dispatch.call('active', this, sectionIndex)
      currentIndex = sectionIndex
    }

    const prevIndex = Math.max(sectionIndex - 1, 0)
    const prevTop = sectionPositions[prevIndex]
    const progress = (pos - prevTop) / (sectionPositions[sectionIndex] - prevTop)
    dispatch.call('progress', this, currentIndex, progress)
  }

  scroll.container = function (value) {
    if (arguments.legth === 0) {
      return container
    }
    container = value
    return scroll
  }

  scroll.on = function (action, callback) {
    dispatch.on(action, callback)
  }

  return scroll
}
