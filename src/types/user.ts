export type AvailabilityPayloadEntry = { day: AvailabilityDay; start: number; end: number };

export type AvailabilityDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export type User = {
  _id: string;
  firstname: string;
  lastname: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  profilePic: string | null;
  role: 'patient' | 'doctor';
  specialty?: string;
  npi?: string; 
  experience?: number;
  price?: number;
  location?: string;
  languages?: string;
  availability?: AvailabilityPayloadEntry[];
  diseases?: string;
  allergies?: string;
  weight?: number;
  height?: number;
};

export type SignupPayload = Omit<User, "_id"> & {
  password: string;
};