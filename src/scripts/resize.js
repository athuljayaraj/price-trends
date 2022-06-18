/**
 *
 */
export function updateResize () {
  const svgSizes = window.getComputedStyle(d3.select('#vizualization-svg').node())
  const vizDivSizes = window.getComputedStyle(d3.select('#vizualization-div').node())
  glob.sizes.vizSvgSizes.width = parseFloat(svgSizes.width.slice(0, -2))
  glob.sizes.vizSvgSizes.height = parseFloat(svgSizes.height.slice(0, -2))
  glob.sizes.vizDivSizes.width = parseFloat(vizDivSizes.width.slice(0, -2))
  glob.sizes.vizDivSizes.height = parseFloat(vizDivSizes.height.slice(0, -2))
}
