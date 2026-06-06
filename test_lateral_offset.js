const trackPath = require('./trackPath_montreal.json');

const minX = Math.min(...trackPath.map(p => p.x));
const maxX = Math.max(...trackPath.map(p => p.x));
const minY = Math.min(...trackPath.map(p => p.y));
const maxY = Math.max(...trackPath.map(p => p.y));

const dx = (maxX - minX) || 1000;
const dy = (maxY - minY) || 1000;
const padding = 20;
const svgW = 400;
const svgH = 260;

const getInterpolatedCoords = (progress, lateralOffset = 0) => {
  const n = trackPath.length;
  let i = Math.floor(progress) % n;
  if (i < 0) i += n;
  const nextIdx = (i + 1) % n;
  const t = progress - Math.floor(progress);

  const p1 = trackPath[i];
  const p2 = trackPath[nextIdx];

  const x = p1.x + (p2.x - p1.x) * t;
  const y = p1.y + (p2.y - p1.y) * t;

  if (lateralOffset === 0) return { x, y };

  const dxCoord = p2.x - p1.x;
  const dyCoord = p2.y - p1.y;

  const circuitDx = (maxX - minX) || 1000;
  const circuitDy = (maxY - minY) || 1000;

  const factorX = (svgW - 2 * padding) / circuitDx;
  const factorY_mag = (svgH - 2 * padding) / circuitDy;

  const dxScreen = dxCoord * factorX;
  const dyScreen = -dyCoord * factorY_mag;

  const lenScreen = Math.sqrt(dxScreen * dxScreen + dyScreen * dyScreen);
  if (lenScreen === 0) return { x, y };

  const pxScreen = -dyScreen / lenScreen;
  const pyScreen = dxScreen / lenScreen;

  const screenOffset = lateralOffset * 0.8;

  const offsetXCartesian = (pxScreen * screenOffset) / factorX;
  const offsetYCartesian = -(pyScreen * screenOffset) / factorY_mag;

  return { x: x + offsetXCartesian, y: y + offsetYCartesian };
};

const scaleX = (x) => padding + ((x - minX) / dx) * (svgW - 2 * padding);
const scaleY = (y) => padding + (1 - (y - minY) / dy) * (svgH - 2 * padding);

[290.656, 281.749].forEach(prog => {
  console.log(`Progress: ${prog}`);
  const base = getInterpolatedCoords(prog, 0);
  const left = getInterpolatedCoords(prog, -5);
  const right = getInterpolatedCoords(prog, 5);
  
  console.log(`  Base SVG: (${scaleX(base.x).toFixed(1)}, ${scaleY(base.y).toFixed(1)})`);
  console.log(`  Left SVG: (${scaleX(left.x).toFixed(1)}, ${scaleY(left.y).toFixed(1)})`);
  console.log(`  Right SVG: (${scaleX(right.x).toFixed(1)}, ${scaleY(right.y).toFixed(1)})`);
});
