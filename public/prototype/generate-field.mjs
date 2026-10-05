// Original deterministic artwork for the first-screen study. Run with Node.
import { writeFileSync } from 'node:fs';
const width = 1600, height = 320, pitch = 8;
const hash = (x, y) => { const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); };
const noise = (x, y) => {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  return (hash(ix, iy) * (1 - u) + hash(ix + 1, iy) * u) * (1 - v) + (hash(ix, iy + 1) * (1 - u) + hash(ix + 1, iy + 1) * u) * v;
};
const paths = new Map();
for (let y = 0; y < height; y += pitch) {
  for (let x = 0; x < width; x += pitch) {
    const nx = x / width, ny = y / height;
    const field = .52 + Math.sin(nx * 9 - .7) * .13 + Math.sin(nx * 19 + .5) * .065 + noise(nx * 13, ny * 5) * .19 + noise(nx * 43, ny * 17) * .07 - ny * .9;
    let color = '#f3f4f5';
    if (field > .03 && !(field < .12 && hash(x, y) > field * 8)) {
      color = field < .12 ? '#161e34' : field < .23 ? '#3049d9' : field < .33 ? '#536bfa' : field < .55 ? '#f6ce25' : field < .69 ? '#fa593e' : '#d8ee40';
    } else if (hash(x, y) < .58) continue;
    paths.set(color, (paths.get(color) || '') + `M${x} ${y}h7v7h-7z`);
  }
}
writeFileSync(new URL('field.svg', import.meta.url), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="white"/>${[...paths].map(([color, path]) => `<path fill="${color}" d="${path}"/>`).join('')}</svg>`);
