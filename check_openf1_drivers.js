async function main() {
  try {
    const res = await fetch('https://api.openf1.org/v1/drivers?session_key=9531');
    const drivers = await res.json();
    console.log(`Drivers count: ${drivers.length}`);
    drivers.forEach((d, i) => {
      console.log(`Index ${i.toString().padStart(2)}: name=${d.name_acronym}, driver_number=${d.driver_number}, team=${d.team_name}`);
    });
  } catch (err) {
    console.error('Error:', err.message);
  }
}
main();
