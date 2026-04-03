type AvailabilityEntry = { day: AvailabilityDay; start: number; end: number };

type AvailabilityDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

type User = {
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
  availability?: AvailabilityEntry[];
  diseases?: string;
  allergies?: string;
  weight?: number;
  height?: number;
};

type SignupPayload = Omit<User, "_id"> & {
  password: string;
};