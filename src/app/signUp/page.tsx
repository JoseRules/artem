'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hasAuthenticatedUserId, useUser } from '@/contexts/UserContext';
import { AvailabilityDay, AvailabilityPayloadEntry, SignupPayload } from '@/types/user';
import { formatHourLabel, toNumberField, toStringField } from '@/utils/formatting';
import { AVAILABILITY_DAYS, AVAILABILITY_HOURS } from '@/utils/constants';
import { uploadProfilePic } from '@/lib/api/user/uploadProfilePic';
import { register } from '@/lib/api/user/register';
import Image from 'next/image';


function buildInitialAvailability(): Record<AvailabilityDay, boolean[]> {
  const slotsCount = AVAILABILITY_HOURS.length;
  return {
    monday: Array(slotsCount).fill(false),
    tuesday: Array(slotsCount).fill(false),
    wednesday: Array(slotsCount).fill(false),
    thursday: Array(slotsCount).fill(false),
    friday: Array(slotsCount).fill(false),
  };
}

function buildAvailabilityPayload(
  availability: Record<AvailabilityDay, boolean[]>,
): AvailabilityPayloadEntry[] {
  const payload: AvailabilityPayloadEntry[] = [];

  AVAILABILITY_DAYS.forEach(({ key }) => {
    const slots = availability[key];

    let startIdx: number | null = null;
    for (let i = 0; i < slots.length; i++) {
      const isAvailable = slots[i];

      if (isAvailable && startIdx === null) {
        startIdx = i;
      }

      if (startIdx !== null && (!isAvailable || i === slots.length - 1)) {
        // Range ends either at the first "false" slot, or at the last slot if it's true.
        const endExclusive = isAvailable ? i + 1 : i;
        const startHour = AVAILABILITY_HOURS[startIdx];
        const endHour = AVAILABILITY_HOURS[endExclusive - 1] + 1;
        payload.push({ day: key, start: startHour, end: endHour });
        startIdx = null;
      }
    }
  });

  return payload;
}

export default function SignUp() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [userType, setUserType] = useState<'patient' | 'doctor' | ''>('');

  useEffect(() => {
    if (hasAuthenticatedUserId(user)) {
      router.replace('/account');
    }
  }, [user, router]);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [availability, setAvailability] = useState<Record<AvailabilityDay, boolean[]>>(
    () => buildInitialAvailability(),
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userType || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      let profilePicUrl: string = "";
      if (profilePicture) {
        profilePicUrl = await uploadProfilePic(profilePicture);
      }

      const basePayload: SignupPayload = {
        profilePic: profilePicUrl ? profilePicUrl : null,
        firstname: toStringField(formData, 'firstName'),
        lastname: toStringField(formData, 'lastName'),
        dateOfBirth: toStringField(formData, 'dateOfBirth'),
        gender: toStringField(formData, 'gender'),
        phone: toStringField(formData, 'phone'),
        email: toStringField(formData, 'email'),
        role: userType,
        password: toStringField(formData, 'password'),
      };

      let payload: SignupPayload;

      if (userType === 'patient') {
        payload = {
          ...basePayload,
          diseases: toStringField(formData, 'chronicDiseases'),
          allergies: toStringField(formData, 'allergies'),
          weight: toNumberField(formData.get('weight')),
          height: toNumberField(formData.get('height')),
        };
      } else {
        payload = {
          ...basePayload,
          specialty: toStringField(formData, 'specialty'),
          npi: toStringField(formData, 'npi'),
          experience: toNumberField(formData.get('yearsOfExperience')),
          price: toNumberField(formData.get('consultingPrice')),
          location: toStringField(formData, 'location'),
          languages: toStringField(formData, 'languages'),
          availability: buildAvailabilityPayload(availability),
        };
      }

      const createdUser = await register(payload);
      setUser(createdUser);
      router.push('/account');
    } catch {
      // Optional: surface error UI later
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="
      flex items-center justify-center
      min-h-[calc(100vh-82px)]
      sm:px-4 sm:px-6 lg:px-8
      py-12
    ">
      <div className="
        w-full max-w-2xl
        space-y-8
      ">
        <div className="text-center space-y-2">
          <h1 className="
            text-3xl sm:text-4xl
            font-bold
            text-foreground
          ">
            Sign Up
          </h1>
          <p className="
            text-lg
            text-foreground/80
          ">
            Create your account to get started
          </p>
        </div>

        <div className="
          bg-muted/50
          border border-border
          rounded-lg
          p-4 sm:p-6 sm:p-8
          space-y-6
        ">
          <form className="space-y-6" onSubmit={handleSignUpSubmit}>
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {profilePicture ? (
                  <div className="relative">
                    <Image
                      src={profilePicture}
                      alt="Profile preview"
                      width={128}
                      height={128}
                      className="
                        w-32 h-32
                        rounded-full
                        object-cover
                        border-4 border-border
                        shadow-md
                      "
                    />
                    <button
                      type="button"
                      onClick={handleButtonClick}
                      className="
                        absolute bottom-0 right-0
                        w-10 h-10
                        rounded-full
                        bg-primary hover:bg-primary/90
                        text-white
                        flex items-center justify-center
                        border-2 border-background
                        shadow-md
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      "
                      aria-label="Change profile picture"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="
                    w-32 h-32
                    rounded-full
                    bg-muted
                    border-4 border-border
                    flex items-center justify-center
                    cursor-pointer
                    hover:bg-accent/50
                    transition-all duration-200
                    group
                  "
                    onClick={handleButtonClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-foreground/40 group-hover:text-primary transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                name="profilePicture"
              />
              {!profilePicture && (
                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="
                    px-4 py-2
                    rounded-lg
                    bg-primary hover:bg-primary/90
                    text-white
                    font-medium
                    transition-all duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    active:scale-95
                  "
                >
                  Add Profile Picture
                </button>
              )}
            </div>

            {/* Personal Information Section */}
            <div className="space-y-4">
              <h2 className="
                text-xl font-semibold
                text-foreground
                pb-2 border-b border-border
              ">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="
                      block text-sm font-medium
                      text-foreground
                      mb-2
                    "
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
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
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="
                      block text-sm font-medium
                      text-foreground
                      mb-2
                    "
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
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
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="
                      block text-sm font-medium
                      text-foreground
                      mb-2
                    "
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    required
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
                  />
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="
                      block text-sm font-medium
                      text-foreground
                      mb-2
                    "
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    required
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
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="
                      block text-sm font-medium
                      text-foreground
                      mb-2
                    "
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
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
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="
                      block text-sm font-medium
                      text-foreground
                      mb-2
                    "
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
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
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>

            {/* User Type Selection */}
            <div className="space-y-4">
              <h2 className="
                text-xl font-semibold
                text-foreground
                pb-2 border-b border-border
              ">
                Account Type
              </h2>

              <div>
                <label className="
                  block text-sm font-medium
                  text-foreground
                  mb-3
                  text-center
                ">
                  Are you a
                </label>
                <div className="flex gap-6 justify-center">
                  <label className="
                    flex items-center
                    cursor-pointer
                    space-x-2
                  ">
                    <input
                      type="radio"
                      name="userType"
                      value="patient"
                      checked={userType === 'patient'}
                      onChange={(e) => setUserType(e.target.value as 'patient' | 'doctor')}
                      required
                      className="
                        w-4 h-4
                        text-primary
                        focus:ring-2 focus:ring-primary
                        border-border
                      "
                    />
                    <span className="text-foreground">Patient</span>
                  </label>

                  <label className="
                    flex items-center
                    cursor-pointer
                    space-x-2
                  ">
                    <input
                      type="radio"
                      name="userType"
                      value="doctor"
                      checked={userType === 'doctor'}
                      onChange={(e) => setUserType(e.target.value as 'patient' | 'doctor')}
                      required
                      className="
                        w-4 h-4
                        text-primary
                        focus:ring-2 focus:ring-primary
                        border-border
                      "
                    />
                    <span className="text-foreground">Doctor</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Patient Specific Fields */}
            {userType === 'patient' && (
              <div className="space-y-4">
                <h2 className="
                  text-xl font-semibold
                  text-foreground
                  pb-2 border-b border-border
                ">
                  Patient Information
                </h2>

                <div>
                  <label
                    htmlFor="chronicDiseases"
                    className="
                      block text-sm font-medium
                      text-foreground
                      mb-2
                    "
                  >
                    Chronic Diseases
                  </label>
                  <textarea
                    id="chronicDiseases"
                    name="chronicDiseases"
                    rows={3}
                    className="
                      w-full
                      px-4 py-2
                      rounded-lg
                      bg-background
                      border border-border
                      text-foreground
                      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                      transition-all duration-200
                      resize-none
                    "
                    placeholder="List any chronic diseases (leave blank if none)"
                  />
                </div>

                <div>
                  <label
                    htmlFor="allergies"
                    className="
                      block text-sm font-medium
                      text-foreground
                      mb-2
                    "
                  >
                    Allergies
                  </label>
                  <textarea
                    id="allergies"
                    name="allergies"
                    rows={3}
                    className="
                      w-full
                      px-4 py-2
                      rounded-lg
                      bg-background
                      border border-border
                      text-foreground
                      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                      transition-all duration-200
                      resize-none
                    "
                    placeholder="List any allergies (leave blank if none)"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="weight"
                      className="
                        block text-sm font-medium
                        text-foreground
                        mb-2
                      "
                    >
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      step="0.1"
                      min="0"
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
                      placeholder="Enter weight in kg"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="height"
                      className="
                        block text-sm font-medium
                        text-foreground
                        mb-2
                      "
                    >
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      step="0.1"
                      min="0"
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
                      placeholder="Enter height in cm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Doctor Specific Fields */}
            {userType === 'doctor' && (
              <div className="space-y-4">
                <h2 className="
                  text-xl font-semibold
                  text-foreground
                  pb-2 border-b border-border
                ">
                  Doctor Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
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
                      name="specialty"
                      required
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
                      <option value="cardiology">Cardiology</option>
                      <option value="dermatology">Dermatology</option>
                      <option value="endocrinology">Endocrinology</option>
                      <option value="gastroenterology">Gastroenterology</option>
                      <option value="general-practice">General Practice</option>
                      <option value="neurology">Neurology</option>
                      <option value="oncology">Oncology</option>
                      <option value="orthopedics">Orthopedics</option>
                      <option value="pediatrics">Pediatrics</option>
                      <option value="psychiatry">Psychiatry</option>
                      <option value="pulmonology">Pulmonology</option>
                      <option value="surgery">Surgery</option>
                      <option value="urology">Urology</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="npi"
                      className="
                        block text-sm font-medium
                        text-foreground
                        mb-2
                      "
                    >
                      NPI (National Provider Identifier)
                    </label>
                    <input
                      type="text"
                      id="npi"
                      name="npi"
                      required
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
                      placeholder="Enter your NPI"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="yearsOfExperience"
                      className="
                        block text-sm font-medium
                        text-foreground
                        mb-2
                      "
                    >
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      min="0"
                      required
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
                      placeholder="Enter years of experience"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="consultingPrice"
                      className="
                        block text-sm font-medium
                        text-foreground
                        mb-2
                      "
                    >
                      Consulting Price ($)
                    </label>
                    <input
                      type="number"
                      id="consultingPrice"
                      name="consultingPrice"
                      min="0"
                      step="0.01"
                      required
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
                      placeholder="Enter consulting price"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="location"
                      className="
                        block text-sm font-medium
                        text-foreground
                        mb-2
                      "
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      required
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
                      placeholder="Enter your location"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="languages"
                      className="
                        block text-sm font-medium
                        text-foreground
                        mb-2
                      "
                    >
                      Languages
                    </label>
                    <input
                      type="text"
                      id="languages"
                      name="languages"
                      required
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
                      placeholder="Enter languages (e.g., English, Spanish, French)"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-lg font-semibold text-foreground pb-2 border-b border-border">
                    Availability
                  </h3>

                  <p className="text-sm text-foreground/70">
                    Select the hours you are available. Slots end at <span className="font-medium text-foreground">9:00 PM</span>.
                  </p>

                  <div className="overflow-x-auto">
                    <div
                      className="
                        grid
                        grid-cols-[72px_repeat(5,minmax(28px,1fr))]
                        gap-1
                        sm:grid-cols-[90px_repeat(5,minmax(0,1fr))]
                        sm:min-w-[560px]
                      "
                      role="group"
                      aria-label="Doctor availability grid"
                    >
                      <div className="text-[11px] sm:text-xs font-medium text-foreground/70 px-2 py-2" />
                      {AVAILABILITY_DAYS.map(({ key, label }) => (
                        <div
                          key={key}
                          className="text-[11px] sm:text-xs font-medium text-foreground/70 px-2 py-2 text-center"
                        >
                          {label}
                        </div>
                      ))}
                      {AVAILABILITY_HOURS.map((hour24, slotIdx) => (
                        <div key={hour24} className="contents">
                          <div className="text-[11px] sm:text-xs text-foreground/70 px-2 py-2">
                            {formatHourLabel(hour24)}
                          </div>
                          {AVAILABILITY_DAYS.map(({ key }) => {
                            const isAvailable = availability[key][slotIdx];
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => {
                                  setAvailability((prev) => {
                                    const next = { ...prev };
                                    const daySlots = [...next[key]];
                                    daySlots[slotIdx] = !daySlots[slotIdx];
                                    next[key] = daySlots;
                                    return next;
                                  });
                                }}
                                aria-pressed={isAvailable}
                                aria-label={`${key} ${formatHourLabel(hour24)} availability: ${isAvailable ? 'available' : 'not available'
                                  }`}
                                className={`
                                  h-8 sm:h-9
                                  w-full
                                  rounded-md
                                  border
                                  transition-colors
                                  focus:outline-none focus:ring-2 focus:ring-primary
                                  ${isAvailable
                                    ? 'bg-primary/20 border-primary/60'
                                    : 'bg-background border-border hover:bg-accent/40'
                                  }
                                `}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  <input
                    type="hidden"
                    name="availability"
                    value={JSON.stringify(buildAvailabilityPayload(availability))}
                  />
                </div>
              </div>
            )}

            {/* Password Section */}
            <div className="space-y-4">
              <h2 className="
                text-xl font-semibold
                text-foreground
                pb-2 border-b border-border
              ">
                Account Security
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="
                      block text-sm font-medium
                      text-foreground
                      mb-2
                    "
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
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
                    placeholder="Enter your password"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="
                      block text-sm font-medium
                      text-foreground
                      mb-2
                    "
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
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
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full
                px-4 py-3
                rounded-lg
                bg-primary hover:bg-primary/90
                text-white
                font-medium
                transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                active:scale-95
                disabled:opacity-70 disabled:pointer-events-none disabled:active:scale-100
                inline-flex items-center justify-center gap-2
              "
            >
              {isSubmitting ? (
                <>
                  <span
                    className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    aria-hidden
                  />
                  Signing up…
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-foreground/70">
              Already have an account?{' '}
              <a
                href="/login"
                className="
                  text-primary hover:text-primary/80
                  font-medium
                  transition-colors duration-200
                "
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
