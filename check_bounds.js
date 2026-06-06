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
    console.log(`Track points: ${track.length}`);
    console.log(`X range: [${minX.toFixed(1)}, ${maxX.toFixed(1)}] (diff: ${(maxX - minX).toFixed(1)})`);
    console.log(`Y range: [${minY.toFixed(1)}, ${maxY.toFixed(1)}] (diff: ${(maxY - minY).toFixed(1)})`);
    
    let totalLen = 0;
    for (let i = 0; i < track.length; i++) {
      const p1 = track[i];
      const p2 = track[(i + 1) % track.length];
      totalLen += Math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2);
    }
    console.log(`Total track length (perimeter) in coordinate units: ${totalLen.toFixed(1)}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}
main();
