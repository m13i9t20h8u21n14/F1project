async function main() {
  try {
    const meetRes = await fetch('https://api.openf1.org/v1/meetings?year=2024');
    const meetings = await meetRes.json();
    const canada = meetings.find(m => 
      m.meeting_name.toLowerCase().includes('canada') || 
      m.location.toLowerCase().includes('montr')
    );
    console.log(`Canada meeting: key=${canada.meeting_key}`);
    
    const sessRes = await fetch(`https://api.openf1.org/v1/sessions?meeting_key=${canada.meeting_key}&session_name=Race`);
    const sessions = await sessRes.json();
    const sessionKey = sessions[0].session_key;
    console.log(`Canada Session Key: ${sessionKey}`);
    
    const gridRes = await fetch(`https://api.openf1.org/v1/starting_grid?session_key=${sessionKey}`);
    const gridData = await gridRes.json();
    console.log('Raw gridData:', gridData);
  } catch (err) {
    console.error('Error:', err.message);
  }
}
main();
