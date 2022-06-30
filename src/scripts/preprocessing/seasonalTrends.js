/* eslint-disable no-undef */ // For the glob variable
/**
 * @param {object[]} dataNorm data with prices of each product per month
 * @param {object[]} seasonalTrends list of products with seasonal trends
 */
export function main (dataNorm, seasonalTrends) {
  const dicoData = {}
  dataNorm.forEach(function (d) {
    if (!dicoData[d.product]) {
      dicoData[d.product] = []
    }
    dicoData[d.product].push({
      date: Date.parse(d.date),
      value: parseFloat(d.value)
    })
  })
  const data = []
  for (const key in dicoData) {
    dicoData[key].sort((a, b) => a.date - b.date)
    // convert back dates in strings
    const tmpSeparator = {}
    dicoData[key].forEach(function (d) {
      const tmpDate = new Date(d.date)
      const newValue = {
        date: new Date(1995, (tmpDate).getMonth(), 1),
        value: d.value,
        originalDate: tmpDate,
        originalYear: tmpDate.getFullYear()
      }
      if (!tmpSeparator[newValue.originalYear]) {
        tmpSeparator[newValue.originalYear] = []
      }
      tmpSeparator[newValue.originalYear].push(newValue)
    })
    // map it to a list of list
    const tmpList = []
    for (const key in tmpSeparator) {
      tmpList.push(tmpSeparator[key])
    }
    data.push({
      name: key,
      values: tmpList,
      minX: new Date(1995, 0, 1),
      maxX: new Date(1995, 11, 1),
      minY: d3.min(dicoData[key], x => x.value),
      maxY: d3.max(dicoData[key], x => x.value)
    })
  }
  glob.data.seasonalTrends = {
    mainData: data,
    selectedProd: seasonalTrends,
    current_selection: seasonalTrends[0]
  }
}
