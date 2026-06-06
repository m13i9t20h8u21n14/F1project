async function main() {
  try {
    const res = await fetch('http://localhost:5001/api/f1/track?year=2024&round=9&session=Race');
    const data = await res.json();
    const track = data.track;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    let minXIdx, maxXIdx, minYIdx, maxYIdx;
    track.forEach((p, i) => {
      if (p.x < minX) { minX = p.x; minXIdx = i; }
      if (p.x > maxX) { maxX = p.x; maxXIdx = i; }
      if (p.y < minY) { minY = p.y; minYIdx = i; }
      if (p.y > maxY) { maxY = p.y; maxYIdx = i; }
    });
    console.log(`Track Length: ${track.length}`);
    console.log(`X bounds: [${minX} at index ${minXIdx}, ${maxX} at index ${maxXIdx}]`);
    console.log(`Y bounds: [${minY} at index ${minYIdx}, ${maxY} at index ${maxYIdx}]`);
    console.log(`Point 0:`, track[0]);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
