export type AccessNotification = {
  notified?: boolean;
};

export type EmailNote = {
  name: string;
  email: string;
  message: string;
  authenticated: boolean;
};

export type Appointment = {
  id: string;
  date: string; // YYYY-MM-DD
  doctorName: string;
  patientName?: string;
  patientEmail?: string;
  specialty: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
};

export type DoctorCard = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  price: number;
};
