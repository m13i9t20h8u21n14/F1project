async function main() {
  try {
    const res = await fetch('http://localhost:5001/api/f1/track?year=2024&round=9&session=Race');
    const data = await res.json();
    const trackPath = data.track;
    
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    trackPath.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });
    
    const dx = maxX - minX || 1;
    const dy = maxY - minY || 1;
    const padding = 15;
    const svgW = 400;
    const svgH = 260;
    
    const scaleX = (x) => padding + ((x - minX) / dx) * (svgW - 2 * padding);
    const scaleY = (y) => padding + (1 - (y - minY) / dy) * (svgH - 2 * padding);
    
    const getInterpolatedCoords = (progress, lateralOffset = 0) => {
      const i = Math.floor(progress) % trackPath.length;
      const nextIdx = (i + 1) % trackPath.length;
      const t = progress - Math.floor(progress);
      const p1 = trackPath[i];
      const p2 = trackPath[nextIdx];
      const x = p1.x + (p2.x - p1.x) * t;
      const y = p1.y + (p2.y - p1.y) * t;
      return { x, y };
    };

    const staggerSpacing = Math.max(0.05, trackPath.length * 0.0016);
    const gridStartOffset = trackPath.length * 0.992;
    console.log(`trackPath.length = ${trackPath.length}`);
    console.log(`staggerSpacing = ${staggerSpacing}`);
    console.log(`gridStartOffset = ${gridStartOffset}`);
    
    for (let index = 0; index < 20; index++) {
      const startProgress = Math.max(0, gridStartOffset - index * staggerSpacing);
      const coords = getInterpolatedCoords(startProgress);
      console.log(`Driver Index ${index.toString().padStart(2)}: progress=${startProgress.toFixed(3)}, SVG=(${scaleX(coords.x).toFixed(1)}, ${scaleY(coords.y).toFixed(1)})`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}
main();
