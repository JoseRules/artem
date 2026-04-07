export async function wakeUp() {
  try {
    const response = await fetch('https://artem-api.onrender.com/api/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}