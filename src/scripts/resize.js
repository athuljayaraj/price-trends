/* eslint-disable no-undef */ // For the glob variable
/**
 *
 */
export function updateResize () {
  const svgSizes = window.getComputedStyle(d3.select('#vizualization-svg1').node())
  const vizDivSizes = window.getComputedStyle(d3.select('#vizualization-svg1').node())
  glob.sizes.vizSvgSizes.width = parseFloat(svgSizes.width.slice(0, -2))
  glob.sizes.vizSvgSizes.height = parseFloat(svgSizes.height.slice(0, -2))
  glob.sizes.vizSvgSizes.innerWidth = glob.sizes.vizSvgSizes.width - glob.sizes.vizSvgSizes.margin.left - glob.sizes.vizSvgSizes.margin.right
  glob.sizes.vizSvgSizes.innerHeight = glob.sizes.vizSvgSizes.height - glob.sizes.vizSvgSizes.margin.top - glob.sizes.vizSvgSizes.margin.bottom
  glob.sizes.vizDivSizes.width = parseFloat(vizDivSizes.width.slice(0, -2))
  glob.sizes.vizDivSizes.height = parseFloat(vizDivSizes.height.slice(0, -2))
}
