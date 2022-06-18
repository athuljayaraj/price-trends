import * as scroller from './scripts/scroller'

scroller.centerSections();
(function (d3) {
  scroller.centerSections()
  document.addEventListener('scroll', function () {
    console.log('scroll')
    scroller.mainScroll()
  }
  )
  window.addEventListener('resize', function () {
    console.log('resize')
    scroller.centerSections();
  })
})(d3)
