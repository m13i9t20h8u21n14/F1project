async function main() {
  try {
    const res = await fetch('http://localhost:5000/api/f1/sessions?year=2024');
    const sessions = await res.json();
    console.log(`Found ${sessions.length} sessions for 2024`);
    const canada = sessions.find(s => s.location.includes('Montreal') || s.meeting_name.includes('Canada'));
    if (!canada) {
      console.log('Canada session not found in archived sessions.');
      return;
    }
    console.log(`Canada session ID: ${canada._id}`);
    
    // Now fetch the full session
    const fullRes = await fetch(`http://localhost:5000/api/f1/session/${canada._id}`);
    const session = await fullRes.json();
    console.log(`Driver grid positions:`);
    session.results.forEach(r => {
      console.log(`Driver ${r.abbreviation} (${r.driver_number}): grid_position=${r.grid_position}, position=${r.position}`);
    });
  } catch (err) {
    console.error('Error:', err.message);
  }
}
main();
