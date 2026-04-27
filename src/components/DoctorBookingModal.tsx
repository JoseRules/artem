import { useState, useMemo } from 'react';
import { User, AvailabilityDay } from '@/types/user';
import { CloseIcon, CalendarIcon, ClockIcon } from '@/assets/icons';
import { formatHourLabel } from '@/utils/formatting';

interface DoctorBookingModalProps {
  doctor: User | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (date: Date, time: string) => void;
}

export default function DoctorBookingModal({ doctor, isOpen, onClose, onBook }: DoctorBookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const availableDays = useMemo(() => {
    if (!doctor?.availability) return [];
    
    // Generate next 14 days
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        
        const dayMap: Record<number, AvailabilityDay> = {
            1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday', 6: 'saturday', 0: 'sunday'
        } as any;
        
        const dayOfWeek = dayMap[d.getDay()];
        
        const availForDay = doctor.availability.filter(a => a.day === dayOfWeek);
        if (availForDay.length > 0) {
            days.push({ date: d, availability: availForDay }); // storing the array for completeness although not strictly used below
        }
    }
    return days;
  }, [doctor]);

  const availableTimes = useMemo(() => {
    if (!selectedDate || !doctor?.availability) return [];
    
    const dayMap: Record<number, AvailabilityDay> = {
        1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday', 6: 'saturday', 0: 'sunday'
    } as any;
    
    const dayOfWeek = dayMap[selectedDate.getDay()];
    const availForDay = doctor.availability.filter(a => a.day === dayOfWeek);
    
    if (availForDay.length === 0) return [];
    
    const hours = new Set<number>();
    availForDay.forEach(avail => {
        for (let h = avail.start; h < avail.end; h++) {
            hours.add(h);
        }
    });
    
    return Array.from(hours).sort((a, b) => a - b).map(h => formatHourLabel(h));
  }, [selectedDate, doctor]);

  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button 
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-muted/50 hover:bg-muted text-foreground/50 hover:text-foreground rounded-full transition-colors"
        >
            <CloseIcon className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-foreground mb-1">Book Appointment</h2>
        <p className="text-foreground/60 mb-6">Schedule a visit with Dr. {doctor.lastname}</p>

        {!doctor.availability || doctor.availability.length === 0 ? (
           <div className="text-center py-8 text-foreground/50 border-2 border-dashed border-border rounded-2xl">
               No availability configured for this doctor.
           </div>
        ) : (
           <div className="space-y-6">
               <div className="space-y-3">
                   <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                       <CalendarIcon className="w-4 h-4 text-primary" /> Select Date
                   </label>
                   <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                        {availableDays.length > 0 ? availableDays.map((d, idx) => {
                            const isSelected = selectedDate?.toDateString() === d.date.toDateString();
                            return (
                                <button
                                    key={idx}
                                    onClick={() => { setSelectedDate(d.date); setSelectedTime(null); }}
                                    className={`
                                        flex-shrink-0 snap-center px-4 py-3 rounded-xl border flex flex-col items-center justify-center min-w-[80px] transition-all
                                        ${isSelected ? 'bg-primary border-primary text-white shadow-md' : 'bg-muted/30 border-border hover:border-primary/50 text-foreground'}
                                    `}
                                >
                                    <span className="text-xs uppercase tracking-wider font-bold opacity-70">
                                        {d.date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </span>
                                    <span className="text-xl font-black mt-1">
                                        {d.date.getDate()}
                                    </span>
                                </button>
                            );
                        }) : (
                            <p className="text-sm text-foreground/60">No upcoming days available.</p>
                        )}
                   </div>
               </div>

               {selectedDate && (
                   <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                       <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                           <ClockIcon className="w-4 h-4 text-primary" /> Select Time
                       </label>
                       <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {availableTimes.length > 0 ? availableTimes.map((t, idx) => {
                                const isSelected = selectedTime === t;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedTime(t)}
                                        className={`
                                            px-3 py-2 rounded-lg border text-sm font-semibold transition-all
                                            ${isSelected ? 'bg-primary border-primary text-white shadow-sm' : 'bg-background border-border hover:border-primary/50 text-foreground'}
                                        `}
                                    >
                                        {t}
                                    </button>
                                );
                            }) : (
                                <p className="text-sm text-foreground/60 col-span-3">No times available on this date.</p>
                            )}
                       </div>
                   </div>
               )}

                <div className="pt-4 mt-6 border-t border-border flex justify-end">
                    <button
                        type="button"
                        onClick={() => {
                            if (selectedDate && selectedTime) {
                                onBook(selectedDate, selectedTime);
                            }
                        }}
                        disabled={!selectedDate || !selectedTime}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                        Confirm Booking
                    </button>
                </div>
           </div>
        )}
      </div>
    </div>
  );
}
