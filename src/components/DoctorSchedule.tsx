import { useUser } from '@/contexts/UserContext';
import { Appointment } from '@/types/general';
import { AvailabilityDay, AvailabilityPayloadEntry } from '@/types/user';
import { AVAILABILITY_DAYS } from '@/utils/constants';
import { formatAppointmentTime, formatHourLabel } from '@/utils/formatting';
import { useMemo, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@/assets/icons';

// Date utility functions
function getMonday(d: Date) {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function isSameDay(d1: Date, d2: Date) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
}

export default function DoctorSchedule({ appointments }: { appointments: Appointment[] }) {
    const { user } = useUser();
    
    // Default to current week's Monday
    const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()));
    const [selectedDayKey, setSelectedDayKey] = useState<AvailabilityDay>(() => {
        const today = new Date();
        const day = today.getDay();
        const mapping: Record<number, AvailabilityDay> = { 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday' };
        return mapping[day] || 'monday';
    });

    const isPatient = user?.role === 'patient';

    // Calculate the date for the selected day in the current week
    const selectedDate = useMemo(() => {
        const dayIndex = AVAILABILITY_DAYS.findIndex(d => d.key === selectedDayKey);
        return addDays(weekStart, dayIndex);
    }, [weekStart, selectedDayKey]);

    const daySchedule = useMemo(() => {
        if (isPatient || !user?.availability) return [];

        const userAvailability = user.availability as AvailabilityPayloadEntry[];
        const dayAvail = userAvailability.filter((a) => a.day === selectedDayKey);

        dayAvail.sort((a, b) => a.start - b.start);

        const schedule: Array<{
            hour: number;
            type: 'appointment' | 'free';
            appointment?: Appointment;
        }> = [];

        dayAvail.forEach((avail) => {
            for (let h = avail.start; h < avail.end; h++) {
                const hourLabel = formatHourLabel(h);
                // Standardize the hour matching by ensuring both have or don't have leading zeros
                // hourLabel from formatting.ts uses leading zero for hours < 10
                const appt = appointments.find((a) => {
                    const apptDate = new Date(a.date);
                    const timeMatch = formatAppointmentTime(a.date) === hourLabel.replace(/^0/, ''); // Remove leading zero if present for comparison
                    return isSameDay(apptDate, selectedDate) && timeMatch;
                });

                schedule.push({
                    hour: h,
                    type: appt ? 'appointment' : 'free',
                    appointment: appt,
                });
            }
        });

        return schedule;
    }, [appointments, isPatient, selectedDayKey, user?.availability, selectedDate]);

    const handlePrevWeek = () => setWeekStart(prev => addDays(prev, -7));
    const handleNextWeek = () => setWeekStart(prev => addDays(prev, 7));

    return (
        <div className="space-y-8">
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">Weekly Overview</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <button 
                                onClick={handlePrevWeek}
                                className="p-2 border border-border rounded-lg hover:bg-muted text-foreground/70 transition-colors"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                            <div className="px-4 py-2 border border-border rounded-lg bg-background text-foreground font-medium flex items-center justify-center min-w-[200px]">
                                {weekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                            <button 
                                onClick={handleNextWeek}
                                className="p-2 border border-border rounded-lg hover:bg-muted text-foreground/70 transition-colors"
                            >
                                <ChevronRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-muted/30 border border-border rounded-3xl overflow-hidden backdrop-blur-sm">
                    <div className="grid grid-cols-5 border-b border-border bg-background/50">
                        {AVAILABILITY_DAYS.map(({ key, label }, index) => {
                            const date = addDays(weekStart, index);
                            const isToday = isSameDay(date, new Date());
                            return (
                                <button
                                    key={key}
                                    onClick={() => setSelectedDayKey(key)}
                                    className={`p-4 text-center border-r border-border last:border-0 transition-colors ${selectedDayKey === key ? 'bg-primary/10' : 'hover:bg-primary/5'}`}
                                >
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedDayKey === key ? 'text-primary' : 'text-foreground/40'}`}>
                                        {label}
                                    </p>
                                    <p className={`text-xl font-black mt-1 ${selectedDayKey === key ? 'text-primary' : (isToday ? 'text-foreground font-bold underline' : 'text-foreground/60')}`}>
                                        {date.getDate()}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-6 bg-background space-y-6">
                        <div className="mb-4 text-sm font-semibold text-foreground/40 capitalize px-2">
                             {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                        {daySchedule.length > 0 ? daySchedule.map((slot) => (
                            <div key={slot.hour} className="flex items-start gap-4 group">
                                <div className="w-20 text-xs font-bold text-foreground/30 text-right py-4">
                                    {formatHourLabel(slot.hour)}
                                </div>

                                {slot.type === 'appointment' && slot.appointment ? (
                                    <div className="flex-1 relative">
                                        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-primary rounded-full shadow-[0_0_12px_rgba(var(--primary),0.4)]"></div>
                                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 hover:bg-primary/10 transition-all cursor-pointer">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-foreground">{slot.appointment.patientName || 'Anonymous Patient'}</h4>
                                                    <p className="text-sm text-foreground/50">{slot.appointment.specialty || 'Consultation'}</p>
                                                </div>
                                                <span className="text-[10px] font-black bg-white/50 border border-primary/20 px-2 py-1 rounded-md text-primary uppercase">Confirmed</span>
                                            </div>
                                            <div className="flex gap-4 mt-3">
                                                <button className="text-[10px] font-bold text-primary hover:underline">View Medical Record</button>
                                                <button className="text-[10px] font-bold text-foreground/40 hover:text-foreground">Reschedule</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1">
                                        <div className="border border-dashed border-border rounded-2xl p-4 flex items-center justify-between text-foreground/40 text-sm font-medium hover:bg-muted/50 transition-colors">
                                            <span>Available Slot</span>
                                            <button className="text-[10px] border border-border px-3 py-1 rounded-full hover:bg-foreground hover:text-background transition-all">Manual Block</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl text-foreground/40">
                                No availability defined for this day.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}