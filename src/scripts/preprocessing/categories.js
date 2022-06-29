/* eslint-disable no-undef */ // For the glob variable
/**
 * @param {object[]} dataNorm
 * @param {object[]} categories
 */
export function main (dataNorm, categories) {
  const out = {
    same_same: [],
    same_diff: [],
    diff_same: []
  }
  Array.from(['same_same', 'same_diff', 'diff_same']).forEach(function (category) {
    out[category] = categories[category].map(function (group, i) {
      const groupD = {
        name: group.name,
        data: group.data.map(function (product) {
          return dataNorm.filter(x => x.product === product).map(x => {
            return {
              product: x.product,
              date: new Date(x.date),
              value: parseFloat(x.value)
            }
          })
        })
      }
      groupD.minX = d3.min(groupD.data, x => d3.min(x, d => d.date))
      groupD.maxX = d3.max(groupD.data, x => d3.max(x, d => d.date))
      groupD.minY = d3.min(groupD.data, x => d3.min(x, d => d.value))
      groupD.maxY = d3.max(groupD.data, x => d3.max(x, d => d.value))
      return groupD
    })
  })
  glob.data.categories = out
}
