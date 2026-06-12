import { addMinutes, format, parse, isBefore, isSameMinute } from 'date-fns';

export function generateTimeSlots(startTime: string, endTime: string, intervalMinutes: number): string[] {
  const slots: string[] = [];
  const baseDate = new Date();
  
  // Parse times
  let start = parse(startTime, 'HH:mm', baseDate);
  let end = parse(endTime, 'HH:mm', baseDate);

  // If end time is before start time, assume it's the next day
  if (isBefore(end, start)) {
    end = addMinutes(end, 24 * 60);
  }

  let current = start;
  
  while (isBefore(current, end) || isSameMinute(current, end)) {
    const next = addMinutes(current, intervalMinutes);
    if (isBefore(next, end) || isSameMinute(next, end)) {
      slots.push(`${format(current, 'HH:mm')} - ${format(next, 'HH:mm')}`);
    }
    current = next;
  }

  return slots;
}
