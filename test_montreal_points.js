const trackPath = [
  {x: 2960.2, y: 2549.6},
  {x: 3001.6, y: 2391.1},
  {x: 3065.4, y: 2147.8},
  {x: 3087.0, y: 2066.0},
  {x: 3151.0, y: 1822.0},
  {x: 3197.2, y: 1646.6},
  {x: 3242.3, y: 1462.2},
  {x: 3279.0, y: 1307.0},
  {x: 3327.0, y: 1071.0},
  {x: 3348.0, y: 950.0},
  {x: 3362.8, y: 854.5}
];

const minX = -2422.0, maxX = 3819.0;
const minY = -2086.6, maxY = 16087.0;

const dx = (maxX - minX) || 1000;
const dy = (maxY - minY) || 1000;
const padding = 20;
const svgW = 400;
const svgH = 260;

const scaleX = (x) => padding + ((x - minX) / dx) * (svgW - 2 * padding);
const scaleY = (y) => padding + (1 - (y - minY) / dy) * (svgH - 2 * padding);

console.log("Track points (283-0):");
trackPath.forEach((p, i) => {
  console.log(`Point ${283+i}: SVG=(${scaleX(p.x).toFixed(1)}, ${scaleY(p.y).toFixed(1)})`);
});

