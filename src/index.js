import * as scroller from './scripts/scroller.js'
import * as resize from './scripts/resize.js'
console.log(window)
window.glob = {
  sizes: {
    vizDivSizes: { width: 0, height: 0 },
    vizSvgSizes: { width: 0, height: 0 }
  }
};
(function (d3) {
  scroller.centerSections()
  resize.updateResize()
  scroller.svgCenter()
  document.addEventListener('scroll', function () {
    scroller.mainScroll()
  }
  )
  window.addEventListener('resize', function () {
    console.log('resize')
    scroller.centerSections()
    resize.updateResize()
  })
})(d3)
