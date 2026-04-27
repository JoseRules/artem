export async function bySpecialty(specialty: string) {
    const res = await fetch(`https://artem-api.onrender.com/api/users?specialty=${specialty}`);
    if (!res.ok) {
        throw new Error('Failed to fetch doctors by specialty');
    }
    const json = await res.json();
    return json;
}