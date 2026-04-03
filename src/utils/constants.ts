const AVAILABILITY_DAYS: Array<{ key: AvailabilityDay; label: string }> = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
];
const AVAILABILITY_START_HOUR = 7;
const AVAILABILITY_END_HOUR = 21;
const AVAILABILITY_HOURS = Array.from(
  { length: AVAILABILITY_END_HOUR - AVAILABILITY_START_HOUR },
  (_, i) => AVAILABILITY_START_HOUR + i,
); 

export { AVAILABILITY_DAYS, AVAILABILITY_START_HOUR, AVAILABILITY_END_HOUR, AVAILABILITY_HOURS };