export interface Service {
  id: string;
  title: string;
  description: string;
  priceRange: string;
  icon: string;
  imageUrl: string;
  category: 'Wellness' | 'Aesthetics' | 'Medical';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  imageUrl: string;
  qualifications: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  treatment: string;
  content: string;
  rating: number;
  date: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  serviceId: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  interest: string;
  source: 'Chatbot' | 'Contact Form';
  status: 'New' | 'Contacted' | 'Converted';
  timestamp: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export type ViewState = 'landing' | 'admin';
export type AdminSection = 'dashboard' | 'appointments' | 'leads' | 'services' | 'content';