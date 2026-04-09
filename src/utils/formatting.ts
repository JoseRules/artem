import { AvailabilityDay } from "@/types/user";

function formatHourLabel(hour24: number) {
  const suffix = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12 < 10 ? '0' + hour12 : hour12}:00 ${suffix}`;
}

function toNumberField(rawValue: FormDataEntryValue | null): number {
  return Number(rawValue ?? '');
}

function toStringField(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '').trim();
}

function formatAppointmentTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hour12}:${formattedMinutes} ${ampm}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function getDayOfWeek(dateString: string): AvailabilityDay | null {
  const date = new Date(dateString);

  const day = date.getDay(); // 0 is Sunday, 1 is Monday...
  const mapping: Record<number, AvailabilityDay> = {
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
  };
  return mapping[day] || null;
}

export { formatHourLabel, toNumberField, toStringField, getDayOfWeek, formatAppointmentTime, formatDate };

