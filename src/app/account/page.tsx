'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

const SPECIALTIES = [
  'cardiology',
  'dermatology',
  'endocrinology',
  'gastroenterology',
  'general-practice',
  'neurology',
  'oncology',
  'orthopedics',
  'pediatrics',
  'psychiatry',
  'pulmonology',
  'surgery',
  'urology',
  'other',
] as const;

const SPECIALTY_LABELS: Record<(typeof SPECIALTIES)[number], string> = {
  cardiology: 'Cardiology',
  dermatology: 'Dermatology',
  endocrinology: 'Endocrinology',
  gastroenterology: 'Gastroenterology',
  'general-practice': 'General Practice',
  neurology: 'Neurology',
  oncology: 'Oncology',
  orthopedics: 'Orthopedics',
  pediatrics: 'Pediatrics',
  psychiatry: 'Psychiatry',
  pulmonology: 'Pulmonology',
  surgery: 'Surgery',
  urology: 'Urology',
  other: 'Other',
};

type Appointment = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // 09:00 AM
  doctorName: string;
  specialty: string;
  status: 'Confirmed' | 'Pending';
};

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  price: number;
};

const DUMMY_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    date: '2026-04-01',
    time: '09:00 AM',
    doctorName: 'Dr. Amelia Stone',
    specialty: 'Cardiology',
    status: 'Confirmed',
  },
  {
    id: 'apt-2',
    date: '2026-04-15',
    time: '01:30 PM',
    doctorName: 'Dr. Noah Patel',
    specialty: 'Dermatology',
    status: 'Pending',
  },
];

const DUMMY_DOCTORS: Doctor[] = [
  { id: 'doc-1', name: 'Dr. Amelia Stone', specialty: 'Cardiology', location: 'Downtown Clinic', price: 120 },
  { id: 'doc-2', name: 'Dr. Noah Patel', specialty: 'Dermatology', location: 'Northside Medical Center', price: 95 },
  { id: 'doc-3', name: 'Dr. Sofia Kim', specialty: 'Neurology', location: 'West End Hospital', price: 140 },
  { id: 'doc-4', name: 'Dr. Ethan Brooks', specialty: 'General Practice', location: 'Lakeside Health', price: 85 },
];

export default function AccountPage() {
  const router = useRouter();
  const { user } = useUser();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace('/');
  }, [ready, router, user]);

  const role = user?.role;
  const isPatient = role === 'patient';

  const [selectedSpecialty, setSelectedSpecialty] = useState<(typeof SPECIALTIES)[number] | ''>('');

  const filteredDoctors = useMemo(() => {
    if (!selectedSpecialty) return DUMMY_DOCTORS;
    const label = SPECIALTY_LABELS[selectedSpecialty];
    return DUMMY_DOCTORS.filter((d) => d.specialty === label);
  }, [selectedSpecialty]);

  if (!ready || !user) return null;

  return (
    <div
      className="
        flex min-h-[calc(100vh-82px)] items-center justify-center
        px-4 py-12
      "
    >
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-2">
          <h1
            className="
              text-3xl sm:text-4xl
              font-bold
              text-foreground
            "
          >
            Account
          </h1>
          <p className="text-lg text-foreground/80">
            Manage your appointments and find doctors by specialty.
          </p>
        </div>

        {isPatient ? (
          <div
            className="
              bg-muted/50
              border border-border
              rounded-lg
              p-4 sm:p-6 sm:p-8
              space-y-8
            "
          >
            {/* Appointments */}
            <section className="space-y-4">
              <h2
                className="
                  text-xl font-semibold
                  text-foreground
                  pb-2 border-b border-border
                "
              >
                Appointments
              </h2>

              {DUMMY_APPOINTMENTS.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DUMMY_APPOINTMENTS.map((apt) => (
                    <div
                      key={apt.id}
                      className="
                        bg-background
                        border border-border
                        rounded-lg
                        p-4
                        space-y-2
                      "
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium text-foreground">{apt.doctorName}</p>
                        <span
                          className="
                            text-xs font-medium
                            px-2 py-1
                            rounded
                            border border-border
                            text-foreground/80
                          "
                        >
                          {apt.status}
                        </span>
                      </div>
                      <div className="text-sm text-foreground/80">
                        {apt.specialty} • {apt.date} at {apt.time}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-foreground/70">No appointments found.</p>
              )}
            </section>

            {/* Doctor search */}
            <section className="space-y-4">
              <h2
                className="
                  text-xl font-semibold
                  text-foreground
                  pb-2 border-b border-border
                "
              >
                Find a Doctor
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="specialty"
                    className="
                      block text-sm font-medium
                      text-foreground
                      mb-2
                    "
                  >
                    Specialty
                  </label>
                  <select
                    id="specialty"
                    value={selectedSpecialty}
                    onChange={(e) => {
                      const value = e.target.value as (typeof SPECIALTIES)[number] | '';
                      setSelectedSpecialty(value);
                    }}
                    className="
                      w-full
                      px-4 py-2
                      rounded-lg
                      bg-background
                      border border-border
                      text-foreground
                      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                      transition-all duration-200
                    "
                  >
                    <option value="">Select specialty</option>
                    {SPECIALTIES.map((spec) => (
                      <option key={spec} value={spec}>
                        {SPECIALTY_LABELS[spec]}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className="
                    w-full
                    sm:w-auto
                    px-4 py-3
                    rounded-lg
                    bg-primary hover:bg-primary/90
                    text-white
                    font-medium
                    transition-all duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    active:scale-95
                  "
                >
                  Search
                </button>
              </div>

              <p className="text-sm text-foreground/70">
                Results update based on the selected specialty.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDoctors.length === 0 ? (
                  <p className="text-sm text-foreground/70 md:col-span-2">
                    No doctors found for this specialty.
                  </p>
                ) : (
                  filteredDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="
                        bg-background
                        border border-border
                        rounded-lg
                        p-4
                        space-y-2
                      "
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-foreground">{doc.name}</p>
                          <p className="text-sm text-foreground/80">{doc.specialty}</p>
                        </div>
                        <p className="text-sm font-semibold text-foreground">{`$${doc.price}`}</p>
                      </div>
                      <p className="text-sm text-foreground/80">{doc.location}</p>
                      <button
                        type="button"
                        className="
                          w-full
                          px-4 py-2
                          rounded-lg
                          border border-border
                          text-foreground
                          font-medium
                          transition-all duration-200 ease-in-out
                          hover:bg-accent/40
                          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                          active:scale-95
                        "
                      >
                        Request Appointment
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        ) : (
          <div
            className="
              bg-muted/50
              border border-border
              rounded-lg
              p-4 sm:p-6 sm:p-8
            "
          >
            <h2
              className="
                text-xl font-semibold
                text-foreground
                pb-2 border-b border-border
              "
            >
              Welcome
            </h2>
            <p className="mt-4 text-sm text-foreground/70">
              This account page is currently tailored for patients.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
