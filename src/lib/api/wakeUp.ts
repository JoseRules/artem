export async function wakeUp() {
  try {
    const response = await fetch('https://artem-api.onrender.com/api/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.log(error);
  }
}