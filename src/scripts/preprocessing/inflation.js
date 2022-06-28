/**
 * @param dataNorm: data with prices of each product per month
 * @param inflationProducts, list of products to highlight
 * @param inflation: inflation data
 */
export function main (dataNorm, inflationProducts, inflation) {
  // Create main object
  const products = [...new Set(Array.from(dataNorm.map(x => x.product)))]
  const productGrowthRate = products.map(product => {
    const category = inflationProducts.includes(product) ? 1 : 0
    const data = dataNorm.filter(x => x.product === product)
    const rateOfChange = []
    for (let i = 1; i < data.length; i++) {
      rateOfChange.push({
        product: product,
        dateStr: data[i].date,
        date: new Date(data[i].date),
        value: (data[i].value - data[i - 1].value) / data[i - 1].value * 100,
        category: category
      })
    }
    return {
      product: product,
      category: category,
      data: rateOfChange,
      active: true
    }
  })
  glob.data.inflation = {
    minX: d3.min(productGrowthRate, x => d3.min(x.data, d => d.date)),
    maxX: d3.max(productGrowthRate, x => d3.max(x.data, d => d.date)),
    minY: d3.min(productGrowthRate, x => d3.min(x.data, d => d.value)),
    maxY: d3.max(productGrowthRate, x => d3.max(x.data, d => d.value))
  }
  productGrowthRate.push({
    product: 'Inflation',
    category: 2,
    data: inflation.map((d, i) => {
      if (i > 0) {
        return {
          product: 'Inflation',
          date: new Date(d.date),
          value: (d['consumer price index'] - inflation[i - 1]['consumer price index']) / inflation[i - 1]['consumer price index'] * 100,
          category: 2
        }
      }
    }
    ).filter(x => x !== undefined),
    active: true
  })
  glob.data.inflation.data = productGrowthRate
}
