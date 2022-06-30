/**
 * Global styling of the graphics
 */
export function main () {
  d3.selectAll('.tick').selectAll('line').attr('stroke', 'var(--front)')
  d3.selectAll('.domain').attr('stroke', 'var(--front)')
  d3.selectAll('.controls').selectAll('p')
    .style('margin', '5px')
    .style('margin-right', '10px')
  d3.selectAll('svg').selectAll('text')
    .attr('fill', 'var(--front)')
    .style('font-size', '16px')
}
