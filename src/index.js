import * as scroller from './scripts/scroller.js'
import * as resize from './scripts/resize.js'
import * as preprocessSeason from './scripts/preprocessing/seasonalTrends.js'
import * as preprocessPriceChanges from './scripts/preprocessing/priceChanges.js'
import * as seasons from './scripts/graphics/seasonalTrends.js'
import * as priceChanges from './scripts/graphics/priceChanges.js'
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
      preprocessSeason.main(dataNorm, seasonalTrends)
      seasons.main(glob.data)
    })
    preprocessPriceChanges.main(dataNorm)
    priceChanges.main(glob.data)
    // build(glob.data)
  })
  
  window.addEventListener('resize', function () {
    console.log('resize')
    d3.select('.visualization-svg').selectAll('*').remove()
    d3.select('.controls').selectAll('*').remove()
    resize.updateResize()
    build()
  })
  function build(data) {
    priceChanges.main(glob.data)
    seasons.main(glob.data)

  }
})(d3)
