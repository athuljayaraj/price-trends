import * as resize from './scripts/resize.js'
import * as preprocessSeason from './scripts/preprocessing/seasonalTrends.js'
import * as preprocessInfl from './scripts/preprocessing/inflation.js'
import * as preprocessSmokers from './scripts/preprocessing/smokers'
import * as seasons from './scripts/graphics/seasonalTrends.js'
import * as smokers from './scripts/graphics/smokers'
import * as inflation from './scripts/graphics/inflation.js'
import * as preprocessCat from './scripts/preprocessing/categories.js'
import * as categories from './scripts/graphics/categories.js'
import * as priceChanges from './scripts/graphics/priceChanges.js'
import * as preprocessPriceChanges from './scripts/preprocessing/priceChanges.js'
window.glob = {
  sizes: {
    vizDivSizes: { width: 0, height: 0 },
    vizSvgSizes: {
      width: 0,
      height: 0,
      margin: { top: 40, right: 80, bottom: 40, left: 80 },
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
  d3.csv('assets/data/data_norm.csv').then(function (dataNorm) {
    d3.json('assets/data/seasonalTrends.json').then(function (seasonalTrends) {
      d3.json('assets/data/inflationProducts.json').then(function (inflationProducts) {
        d3.csv('assets/data/inflation.csv').then(function (inflation) {
          d3.json('assets/data/categories_groups.json').then(function (categories) {
            preprocessSeason.main(dataNorm, seasonalTrends)
            preprocessSmokers.main(dataNorm)
            preprocessInfl.main(dataNorm, inflationProducts, inflation)
            preprocessCat.main(dataNorm, categories)
            build(glob.data)
          })
        })
      })
    })
    preprocessPriceChanges.main(dataNorm)
    priceChanges.main(glob.data)
  })

  window.addEventListener('resize', function () {
    d3.selectAll('.visualization-svg').selectAll('*').remove()
    d3.selectAll('.controls').selectAll('*').remove()
    resize.updateResize()
    build()
    priceChanges.main(glob.data)
  })
  function build(data) {
    seasons.main(glob.data)
    smokers.main(glob.data.smokers)
    inflation.main()
    categories.main()
  }
})(d3)
