async function trigger() {
  const url = 'http://localhost:5000/api/f1/archive';
  console.log(`Sending POST request to ${url}...`);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year: 2024, round: 24, session_type: 'Race' })
    });
    console.log('Status code:', res.status);
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('Error triggering archive:', err);
  }
}
trigger();
