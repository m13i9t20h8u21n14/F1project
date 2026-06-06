async function main() {
  try {
    const res = await fetch('http://localhost:5001/api/f1/track?year=2024&round=9&session=Race');
    const data = await res.json();
    const track = data.track;
    
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    track.forEach(p => {
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
    
    console.log(`Track points count: ${track.length}`);
    for (let i = 0; i < track.length; i += 20) {
      const p = track[i];
      console.log(`Index ${i.toString().padStart(3)}: coords=(${p.x.toFixed(1)}, ${p.y.toFixed(1)}), SVG=(${scaleX(p.x).toFixed(1)}, ${scaleY(p.y).toFixed(1)})`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}
main();
