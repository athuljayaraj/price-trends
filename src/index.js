import * as resize from './scripts/resize.js'
import * as preprocessSeason from './scripts/preprocessing/seasonalTrends.js'
import * as preprocessInfl from './scripts/preprocessing/inflation.js'
import * as preprocessSmokers from './scripts/preprocessing/smokers.js'
import * as seasons from './scripts/graphics/seasonalTrends.js'
import * as smokers from './scripts/graphics/smokers.js'
import * as inflation from './scripts/graphics/inflation.js'
import * as preprocessCat from './scripts/preprocessing/categories.js'
import * as categories from './scripts/graphics/categories.js'
import * as priceChanges from './scripts/graphics/priceChanges.js'
import * as preprocessPriceChanges from './scripts/preprocessing/priceChanges.js'
import * as styling from './scripts/graphics/styling.js'

const DATA_DIR = 'src/assets/data/'

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

/**
 *
 */
(function (d3) {
  resize.updateResize()
  d3.csv(`${DATA_DIR}data_norm.csv`).then(function (dataNorm) {
    d3.json(`${DATA_DIR}seasonalTrends.json`).then(function (seasonalTrends) {
      d3.json(`${DATA_DIR}inflationProducts.json`).then(function (inflationProducts) {
        d3.csv(`${DATA_DIR}inflation.csv`).then(function (inflation) {
          d3.json(`${DATA_DIR}categories_groups.json`).then(function (categories) {
            preprocessSeason.main(dataNorm, seasonalTrends)
            preprocessSmokers.main(dataNorm)
            preprocessInfl.main(dataNorm, inflationProducts, inflation)
            preprocessCat.main(dataNorm, categories)
            preprocessPriceChanges.main(dataNorm)
            positionIntro()
            build()
          })
        })
      })
    })
  })

  window.addEventListener('resize', () => {
    d3.selectAll('.visualization-svg').selectAll('*').remove()
    d3.selectAll('.controls').selectAll('*').remove()
    resize.updateResize()
    positionIntro()
    build()
  })

  /**
   *
   * Function to build all the visualizations on the page
   */
  function build() {
    d3.selectAll('.tmp').remove()
    d3.select('#tooltip').remove()
    seasons.main(glob.data)
    smokers.main(glob.data.smokers)
    inflation.main()
    categories.main()
    priceChanges.main(glob.data)
    styling.main()
  }
})(d3)

function positionIntro() {
  const boundings = d3.select('#introduction').node().getBoundingClientRect()
  d3.select('#introduction').style('margin-top', 'calc(50vh - ' + boundings.height / 2 + 'px)')
  d3.select('#introduction').style('margin-bottom', 'calc(50vh - ' + boundings.height / 2 + 'px)')
}
