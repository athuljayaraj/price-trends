import * as resize from './scripts/resize.js'
import * as preprocessSeason from './scripts/preprocessing/seasonalTrends.js'
import * as preprocessInfl from './scripts/preprocessing/inflation.js'
import * as seasons from './scripts/graphics/seasonalTrends.js'
import * as inflation from './scripts/graphics/inflation.js'
window.glob = {
  sizes: {
    vizDivSizes: { width: 0, height: 0 },
    vizSvgSizes: {
      width: 0,
      height: 0,
      margin: { top: 40, right: 40, bottom: 40, left: 40 },
      innerWidth: 0,
      innerHeight: 0
    },
    tooltip: {
      offsetX: 15,
      offsetY: 20
    }
  },
  data: {}
};
(function (d3) {
  // TODO: programmatically add the sections texts
  // scroller.centerSections()
  resize.updateResize()
  // scroller.svgCenter()
  d3.csv('data_norm.csv').then(function (dataNorm) {
    d3.json('seasonalTrends.json').then(function (seasonalTrends) {
      d3.json('inflationProducts.json').then(function (inflationProducts) {
        d3.csv('inflation.csv').then(function (inflation) {
          preprocessSeason.main(dataNorm, seasonalTrends)
          preprocessInfl.main(dataNorm, inflationProducts, inflation)
          build(glob.data)
        })
      })
    })
  })

  window.addEventListener('resize', function () {
    d3.selectAll('.visualization-svg').selectAll('*').remove()
    d3.selectAll('.controls').selectAll('*').remove()
    resize.updateResize()
    build()
  })
  function build (data) {
    seasons.main(glob.data)
    inflation.main()
  }
})(d3)
