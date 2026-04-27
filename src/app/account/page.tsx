'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { getApptsByUser } from '@/lib/api/appts/byUser';
import { bookAppt } from '@/lib/api/appts/book';
import { bySpecialty } from '@/lib/api/user/bySpecialty';
import { AVAILABILITY_DAYS, AVAILABILITY_HOURS, SPECIALTY_LABELS } from '@/utils/constants';
import { AvailabilityDay, AvailabilityPayloadEntry, User } from '@/types/user';
import { ArrowRightIcon, CalendarIcon, ChevronDownIcon, ClockIcon, MapPinIcon } from '@/assets/icons';
import { formatAppointmentTime, formatDate } from '@/utils/formatting';
import DoctorSchedule from '@/components/DoctorSchedule';
import DoctorBookingModal from '@/components/DoctorBookingModal';
import { SPECIALTIES } from '@/utils/constants';
import { Appointment } from '@/types/general';

const DUMMY_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    date: '2026-04-01',
    doctorName: 'Dr. Amelia Stone',
    specialty: 'Cardiology',
    status: 'Confirmed',
  },
  {
    id: 'apt-2',
    date: '2026-04-15',
    doctorName: 'Dr. Noah Patel',
    specialty: 'Dermatology',
    status: 'Pending',
  },
];

export default function AccountPage() {
  const router = useRouter();
  const { user } = useUser();
  const [ready, setReady] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const role = user?.role;
  const isPatient = role === 'patient';
  const [selectedSpecialty, setSelectedSpecialty] = useState<(typeof SPECIALTIES)[number] | ''>('');
  const [searchedDoctors, setSearchedDoctors] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<User | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleBookClick = (doc: User) => {
    setSelectedDoctorForBooking(doc);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (date: Date, time: string) => {
    if (!user?._id || !selectedDoctorForBooking?._id) return;
    
    // Parse time like '09:00 AM' or '02:00 PM'
    const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    let hours = 0;
    let minutes = 0;
    if (match) {
        hours = parseInt(match[1], 10);
        minutes = parseInt(match[2], 10);
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
    }
    
    const finalDate = new Date(date);
    finalDate.setHours(hours, minutes, 0, 0);

    try {
      setHasSearched(false); // reset state if needed
      await bookAppt(user._id, selectedDoctorForBooking._id, finalDate.toISOString());
      
      // Update local state without needing full refresh
      const newApt: Appointment = {
          id: Math.random().toString(), // temporary until fetch
          date: finalDate.toISOString(),
          doctorName: `Dr. ${selectedDoctorForBooking.firstname} ${selectedDoctorForBooking.lastname}`,
          specialty: selectedDoctorForBooking.specialty || 'General',
          status: 'Pending',
      }
      setAppointments(prev => [...prev, newApt]);
      
      alert(`Booking confirmed for ${date.toLocaleDateString()} at ${time} with Dr. ${selectedDoctorForBooking?.lastname}`);
      setIsBookingModalOpen(false);
    } catch(err) {
      console.error(err);
      alert('Failed to book appointment');
    }
  };

  const handleSearchDoctors = async () => {
    setIsSearching(true);
    setHasSearched(true);
    try {
      const data = await bySpecialty(selectedSpecialty);
      if (Array.isArray(data)) {
        setSearchedDoctors(data);
      } else {
        setSearchedDoctors([]);
      }
    } catch (error) {
      console.error('Failed to fetch doctors', error);
      setSearchedDoctors([]);
    }
    setIsSearching(false);
  };

  useEffect(() => {
    async function fetchAppts() {
      if (user?._id) {
        try {
          const data = await getApptsByUser(user._id);
          if (Array.isArray(data)) {
            // Map API data to our Appointment type
            const mapped = data.map((a: any) => {
              const pFirst = a.patient?.firstname || '';
              const pLast = a.patient?.lastname || '';
              const pName = (pFirst || pLast) ? `${pFirst} ${pLast}`.trim() : a.patientName || 'Anonymous';
              const pEmail = a.patient?.email || a.patientEmail;

              const dFirst = a.doctor?.firstname || '';
              const dLast = a.doctor?.lastname || '';
              const dName = (dFirst || dLast) ? `Dr. ${dFirst} ${dLast}`.trim() : a.doctorName || 'Dr. Assigned';

              return ({
                id: a._id || a.id,
                date: a.date,
                doctorName: dName,
                specialty: a.doctor?.specialty || a.specialty || 'General',
                status: a.status || 'Confirmed',
                patientName: pName,
                patientEmail: pEmail,
              })
            });
            setAppointments(mapped);
          }
        } catch (error) {
          console.error('Error fetching appointments:', error);
        }
      }
      setLoading(false);
    }

    setReady(true);
    fetchAppts();
  }, [user]);

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace('/');
  }, [ready, router, user]);

  const displayAppointments = useMemo(() => {
    if (isPatient) {
      return [...appointments, ...DUMMY_APPOINTMENTS];
    }
    return appointments;
  }, [appointments, isPatient]);





  if (!ready || !user) return null;

  return (
    <div
      className="
        flex min-h-[calc(100vh-82px)] items-start justify-center
        px-4 py-12 bg-background
      "
    >
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1
              className="
                text-3xl sm:text-4xl
                font-bold
                text-foreground tracking-tight
              "
            >
              Hello, {typeof user.firstname === 'string' ? `${user.firstname} ${user.lastname}` : 'User'}!
            </h1>

            <p className="text-lg text-foreground/60">
              {isPatient
                ? 'Your health journey is looking great. Manage your visits here.'
                : 'Here is your schedule for the upcoming days.'}
            </p>
          </div>
          <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <span className="text-sm font-semibold text-primary capitalize">{role} Account</span>
          </div>
        </div>

        {isPatient ? (
          <div className="space-y-12">
            {/* Appointments Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">My Appointments</h2>
                <div className="h-px flex-1 mx-4 bg-border hidden sm:block"></div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
                  <div className="h-32 bg-muted rounded-xl border border-border" />
                  <div className="h-32 bg-muted rounded-xl border border-border" />
                </div>
              ) : displayAppointments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayAppointments.map((apt: Appointment) => (
                    <div
                      key={apt.id}
                      className="
                        group relative
                        bg-background
                        border border-border/60
                        rounded-2xl
                        p-6
                        shadow-sm hover:shadow-xl hover:shadow-primary/5
                        transition-all duration-300
                        hover:-translate-y-1
                      "
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary group-transition text-primary group-hover:text-white transition-colors duration-300">
                          <ClockIcon className="w-5 h-5" />
                        </div>
                        <span
                          className={`
                            text-[10px] font-bold tracking-wider uppercase
                            px-2.5 py-1
                            rounded-full
                            border
                            ${apt.status === 'Confirmed'
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}
                          `}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-lg text-foreground">{apt.doctorName}</p>
                        <p className="text-sm font-medium text-primary">{apt.specialty}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/40 flex items-center text-sm text-foreground/60 gap-3">
                        <span className="flex items-center gap-1.5">
                          <CalendarIcon className="w-4 h-4" />
                          {apt.date}
                        </span>
                        <span>•</span>
                        <span className="font-medium">{formatAppointmentTime(apt.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
                  <p className="text-foreground/50">No appointments found.</p>
                </div>
              )}
            </section>

            {/* Doctor search */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Find a Specialist</h2>
                <div className="h-px flex-1 mx-4 bg-border hidden sm:block"></div>
              </div>

              <div className="bg-muted/30 p-1 rounded-2xl border border-border backdrop-blur-sm">
                <div className="bg-background rounded-[calc(1rem-2px)] p-6 space-y-6 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div className="md:col-span-2 space-y-2">
                      <label htmlFor="specialty" className="block text-sm font-semibold text-foreground/70 ml-1">
                        Select Medical Specialty
                      </label>
                      <div className="relative">
                        <select
                          id="specialty"
                          value={selectedSpecialty}
                          onChange={(e) => setSelectedSpecialty(e.target.value as any)}
                          className="
                            w-full appearance-none
                            pl-4 pr-10 py-3
                            rounded-xl
                            bg-muted/50 hover:bg-muted
                            border border-border
                            text-foreground font-medium
                            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                            transition-all duration-200
                          "
                        >
                          <option value="">All Specialties</option>
                          {SPECIALTIES.map((spec) => (
                            <option key={spec} value={spec}>
                              {SPECIALTY_LABELS[spec]}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/40">
                          <ChevronDownIcon className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSearchDoctors}
                      disabled={isSearching}
                      className="
                        px-8 py-3.5
                        rounded-xl
                        bg-primary
                        text-white font-bold
                        shadow-lg shadow-primary/25
                        hover:shadow-xl hover:shadow-primary/30
                        hover:scale-[1.02] active:scale-95
                        transition-all duration-200
                        disabled:opacity-50 disabled:pointer-events-none
                      "
                    >
                      {isSearching ? 'Searching...' : 'Search Doctors'}
                    </button>
                  </div>

                  {hasSearched && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border mt-4">
                      {searchedDoctors.length > 0 ? (
                        searchedDoctors.map((doc: User) => (
                          <div
                            key={doc._id}
                            className="
                              relative overflow-hidden
                              bg-background
                              border border-border/60
                              rounded-2xl
                              p-6
                              hover:border-primary/40
                              transition-all group
                            "
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex gap-4">
                                {doc.profilePic ? (
                                  <img 
                                    src={doc.profilePic} 
                                    alt={`Dr. ${doc.lastname}`}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 mt-1"
                                  />
                                ) : (
                                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 mt-1">
                                    <span className="text-lg font-bold text-primary">
                                      {doc.firstname?.[0]}{doc.lastname?.[0]}
                                    </span>
                                  </div>
                                )}
                                <div className="space-y-1">
                                  <h3 className="font-bold text-lg">Dr. {doc.firstname} {doc.lastname}</h3>
                                  <p className="text-primary text-sm font-semibold">
                                    {doc.specialty ? (SPECIALTY_LABELS[doc.specialty.toLowerCase() as keyof typeof SPECIALTY_LABELS] || doc.specialty) : 'General Practice'}
                                  </p>
                                  <p className="text-foreground/50 text-xs flex items-center gap-1 mt-1">
                                    <MapPinIcon className="w-3 h-3 text-red-400" />
                                    {doc.location || 'Remote'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xl font-black text-foreground">${doc.price || '150'}</span>
                                <p className="text-[10px] text-foreground/40 uppercase font-bold tracking-tighter">per visit</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleBookClick(doc)}
                              className="
                                w-full mt-6
                                px-4 py-3
                                rounded-xl
                                bg-foreground text-background
                                font-bold text-sm
                                group-hover:bg-primary group-hover:text-white
                                transition-all duration-300
                                flex items-center justify-center gap-2
                              "
                            >
                              Book Appointment
                              <ArrowRightIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-1 sm:col-span-2 text-center py-8 text-foreground/50">
                          {isSearching ? 'Loading doctors...' : 'No doctors found for this specialty.'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* DOCTOR VIEW - SCHEDULE */
          <DoctorSchedule appointments={appointments} />
        )}
      </div>

      <DoctorBookingModal
        doctor={selectedDoctorForBooking}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBook={handleConfirmBooking}
      />
    </div>
  );
}


