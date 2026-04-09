'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { getApptsByUser } from '@/lib/api/appts/byUser';
import { AVAILABILITY_DAYS, AVAILABILITY_HOURS, SPECIALTY_LABELS } from '@/utils/constants';
import { AvailabilityDay, AvailabilityPayloadEntry } from '@/types/user';
import { ArrowRightIcon, CalendarIcon, ChevronDownIcon, ClockIcon, MapPinIcon } from '@/assets/icons';
import { formatAppointmentTime, formatDate } from '@/utils/formatting';
import DoctorSchedule from '@/components/DoctorSchedule';
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

  useEffect(() => {
    async function fetchAppts() {
      if (user?._id) {
        try {
          const data = await getApptsByUser(user._id);
          if (Array.isArray(data)) {
            // Map API data to our Appointment type
            const mapped = data.map((a: any) => {
              return ({
                id: a._id || a.id,
                date: a.date,
                doctorName: a.doctorName || 'Dr. Assigned',
                specialty: a.specialty || 'General',
                status: a.status || 'Confirmed',
                patientName: a.patientName || 'Anonymous',
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
                      className="
                        px-8 py-3.5
                        rounded-xl
                        bg-primary
                        text-white font-bold
                        shadow-lg shadow-primary/25
                        hover:shadow-xl hover:shadow-primary/30
                        hover:scale-[1.02] active:scale-95
                        transition-all duration-200
                      "
                    >
                      Search Doctors
                    </button>
                  </div>

                  {/*<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    {filteredDoctors.map((doc: Doctor) => (
                      <div
                        key={doc.id}
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
                          <div className="space-y-1">
                            <h3 className="font-bold text-lg">{doc.name}</h3>
                            <p className="text-primary text-sm font-semibold">{doc.specialty}</p>
                            <p className="text-foreground/50 text-xs flex items-center gap-1 mt-1">
                              <MapPinIcon className="w-3 h-3 text-red-400" />
                              {doc.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-black text-foreground">${doc.price}</span>
                            <p className="text-[10px] text-foreground/40 uppercase font-bold tracking-tighter">per visit</p>
                          </div>
                        </div>
                        <button
                          type="button"
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
                    ))}
                  </div>*/}
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* DOCTOR VIEW - SCHEDULE */
          <DoctorSchedule appointments={appointments} />
        )}
      </div>
    </div>
  );
}


