/**
 * @param dataNorm
 * @param categories
 */
export function main(dataNorm) {
  const cigaretteKey = 'Cigarettes (200)'
  const out = dataNorm.filter(data => data.product === cigaretteKey).map(data => [new Date(data.date), parseFloat(data.value)])
  const limits = {
    minX: d3.min(out.map(d => new Date(d[0]))),
    maxX: d3.max(out.map(d => new Date(d[0]))),
    minY: d3.min(out.map(d => parseFloat(d[1]))),
    maxY: d3.max(out.map(d => parseFloat(d[1])))
  }

  glob.data.smokers = { data: out, limits: limits }
}
