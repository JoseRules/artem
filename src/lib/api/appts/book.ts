export async function bookAppt(patient: string, doctor: string, date: string) {
    const response = await fetch('https://artem-api.onrender.com/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
            patient,
            doctor,
            date,
            notes: "Booked from frontend"
        }),
    });
    const json = await response.json();
    return json;
}
