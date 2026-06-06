async function main() {
  try {
    const res = await fetch('http://localhost:5001/api/f1/laps?year=2024&round=9&session=Race');
    const laps = await res.json();
    const lap1s = laps.filter(l => l.lap_number === 1);
    console.log(`Total Lap 1 records: ${lap1s.length}`);
    lap1s.forEach(l => {
      console.log(`Driver ${l.abbreviation} (${l.driver_number}): lap_time="${l.lap_time}", compound="${l.compound}", is_pit_out_lap=${l.is_pit_out_lap}`);
    });
  } catch (err) {
    console.error('Error:', err.message);
  }
}
main();
