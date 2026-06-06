async function main() {
  try {
    const res = await fetch('http://localhost:5001/api/f1/track?year=2024&round=9&session=Race');
    const data = await res.json();
    const track = data.track;
    console.log(`Track points count: ${track.length}`);
    for (let i = 0; i < 5; i++) {
      console.log(`Point ${i}: x=${track[i].x.toFixed(1)}, y=${track[i].y.toFixed(1)}`);
    }
    const startIdx = track.length - 10;
    for (let i = startIdx; i < track.length; i++) {
      console.log(`Point ${i}: x=${track[i].x.toFixed(1)}, y=${track[i].y.toFixed(1)}`);
    }
    
    // Let's compute coordinate distances between consecutive points
    let maxDist = 0, maxIdx = 0;
    for (let i = 0; i < track.length; i++) {
      const p1 = track[i];
      const p2 = track[(i + 1) % track.length];
      const dist = Math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2);
      if (dist > maxDist) {
        maxDist = dist;
        maxIdx = i;
      }
    }
    console.log(`Maximum segment distance: ${maxDist.toFixed(1)} at index ${maxIdx}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}
main();
