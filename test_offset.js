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
    
    const factorX = (svgW - 2 * padding) / dx;
    const factorY_mag = (svgH - 2 * padding) / dy;
    
    const scaleX = (x) => padding + ((x - minX) / dx) * (svgW - 2 * padding);
    const scaleY = (y) => padding + (1 - (y - minY) / dy) * (svgH - 2 * padding);

    const getInterpolatedCoordsOld = (progress, lateralOffset = 0) => {
      const i = Math.floor(progress) % trackPath.length;
      const nextIdx = (i + 1) % trackPath.length;
      const t = progress - Math.floor(progress);
      
      const p1 = trackPath[i];
      const p2 = trackPath[nextIdx];
      
      const x = p1.x + (p2.x - p1.x) * t;
      const y = p1.y + (p2.y - p1.y) * t;

      if (lateralOffset === 0) return { x, y };

      const dxCoord = p2.x - p1.x;
      const dyCoord = p2.y - p1.y;
      const len = Math.sqrt(dxCoord * dxCoord + dyCoord * dyCoord);
      if (len === 0) return { x, y };

      const px = -dyCoord / len;
      const py = dxCoord / len;

      const circuitWidth = (maxX - minX) || 1000;
      const cartesianOffset = lateralOffset * circuitWidth * 0.015;

      return {
        x: x + px * cartesianOffset,
        y: y + py * cartesianOffset
      };
    };

    const getInterpolatedCoordsCalibrated = (progress, lateralOffset = 0) => {
      const i = Math.floor(progress) % trackPath.length;
      const nextIdx = (i + 1) % trackPath.length;
      const t = progress - Math.floor(progress);
      
      const p1 = trackPath[i];
      const p2 = trackPath[nextIdx];
      
      const x = p1.x + (p2.x - p1.x) * t;
      const y = p1.y + (p2.y - p1.y) * t;

      if (lateralOffset === 0) return { x, y };

      const dxCoord = p2.x - p1.x;
      const dyCoord = p2.y - p1.y;

      const dxScreen = dxCoord * factorX;
      const dyScreen = -dyCoord * factorY_mag;
      
      const lenScreen = Math.sqrt(dxScreen * dxScreen + dyScreen * dyScreen);
      if (lenScreen === 0) return { x, y };

      const pxScreen = -dyScreen / lenScreen;
      const pyScreen = dxScreen / lenScreen;

      const screenOffset = lateralOffset * 0.8;

      const offsetXScreen = pxScreen * screenOffset;
      const offsetYScreen = pyScreen * screenOffset;

      const offsetXCartesian = offsetXScreen / factorX;
      const offsetYCartesian = -offsetYScreen / factorY_mag;

      return {
        x: x + offsetXCartesian,
        y: y + offsetYCartesian
      };
    };

    const indices = [0, 50, 100, 150, 200, 250];
    indices.forEach(idx => {
      const pBase = getInterpolatedCoordsOld(idx, 0);
      const pOld = getInterpolatedCoordsOld(idx, 5);
      const pNew = getInterpolatedCoordsCalibrated(idx, 5);
      
      const x1 = scaleX(pBase.x);
      const y1 = scaleY(pBase.y);
      const xOld = scaleX(pOld.x);
      const yOld = scaleY(pOld.y);
      const xNew = scaleX(pNew.x);
      const yNew = scaleY(pNew.y);
      
      const distOld = Math.sqrt((xOld - x1)**2 + (yOld - y1)**2);
      const distNew = Math.sqrt((xNew - x1)**2 + (yNew - y1)**2);
      console.log(`Index ${idx.toString().padStart(3)}: Old distance: ${distOld.toFixed(2)} px | New distance: ${distNew.toFixed(2)} px`);
    });

  } catch (err) {
    console.error('Error:', err.message);
  }
}
main();
