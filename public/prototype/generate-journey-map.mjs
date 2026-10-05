// Natural Earth 1:110m land, public domain. See data/README.md.
// Run from any directory: node public/prototype/generate-journey-map.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const land = JSON.parse(readFileSync(new URL('data/land.geojson', import.meta.url)));
const polygons = land.features.flatMap(({ geometry }) => geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates);
const insideRing = (x, y, ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const bounded = polygons.map(rings => ({ rings, minX: Math.min(...rings[0].map(p => p[0])), maxX: Math.max(...rings[0].map(p => p[0])), minY: Math.min(...rings[0].map(p => p[1])), maxY: Math.max(...rings[0].map(p => p[1])) }));
let pixels = '';
for (let y = 0; y < 560; y += 6) for (let x = 0; x < 1200; x += 6) {
  const lon = (x + 3) / 1200 * 360 - 180, lat = 85 - (y + 3) / 560 * 150;
  const isLand = bounded.some(p => lon >= p.minX && lon <= p.maxX && lat >= p.minY && lat <= p.maxY && insideRing(lon, lat, p.rings[0]) && !p.rings.slice(1).some(r => insideRing(lon, lat, r)));
  if (!isLand) continue;
  pixels += `M${x} ${y}h5v5h-5z`;
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 560"><title>A gray pixel world map</title><path fill="#b8bbc2" d="${pixels}"/></svg>`;
writeFileSync(new URL('journey-map.svg', import.meta.url), svg);
console.log(`Generated pixel map (${Math.round(svg.length / 1024)} KB)`);
