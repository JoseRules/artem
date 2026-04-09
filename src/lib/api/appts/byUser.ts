export async function getApptsByUser(id: string) {
    const response = await fetch(`https://artem-api.onrender.com/api/appts/user/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
    });
    const json = await response.json();
    return json;
}