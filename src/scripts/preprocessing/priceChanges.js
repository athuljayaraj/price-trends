/* eslint-disable no-undef */ // For the glob variable
/**
 * @param {object[]} dataNorm The data set to process
 */
export function main (dataNorm) {
  const dicoData = {}
  dataNorm.forEach(function (d) {
    if (!dicoData[d.product]) {
      dicoData[d.product] = []
    }
    const date = d.date.slice(0, -2) + '02' // Because the 1st day returns the previous month

    dicoData[d.product][date] = {}
    dicoData[d.product][date].value = parseFloat(d.value)
  })

  const data = []
  for (const key in dicoData) {
    for (const date in dicoData[key]) {
      data.push({
        product: key,
        date: date,
        price: dicoData[key][date].value
      })
    }
  }

  glob.data.priceChanges = {
    mainData: data,
    minDate: d3.min(dataNorm, d => (new Date(d.date.slice(0, -2) + '02')).getTime()),
    maxDate: d3.max(dataNorm, d => (new Date(d.date.slice(0, -2) + '02')).getTime())
  }
}
