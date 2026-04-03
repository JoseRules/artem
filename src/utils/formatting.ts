function formatHourLabel(hour24: number) {
  const suffix = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12 < 10 ? '0' + hour12 : hour12}:00 ${suffix}`;
}

function toNumberField(rawValue: FormDataEntryValue | null): number{
  return Number(rawValue ?? '');
}

function toStringField(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '').trim();
}

export { formatHourLabel, toNumberField, toStringField };