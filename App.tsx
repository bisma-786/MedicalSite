import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  MOCK_SERVICES, MOCK_DOCTORS, MOCK_TESTIMONIALS, FAQS,
  CLINIC_NAME, CLINIC_ADDRESS, CLINIC_PHONE
} from './constants';
import { Service, Doctor, Appointment, Lead, ViewState, AdminSection, Testimonial } from './types';
import { Chatbot } from './components/Chatbot';
import { BookingModal } from './components/BookingModal';
import ParallaxBackground from './components/ParallaxBackground';
import ParallaxSection from './components/ParallaxSection';
import AdminAuth from './components/AdminAuth';
import {
  Phone, MapPin, Clock, Facebook, Instagram, Twitter,
  Menu, X, ChevronRight, Star, Calendar, ArrowRight,
  ShieldCheck, Activity, BarChart3, Users, FileText,
  Settings, LogOut, CheckCircle, Search, Plus, Sparkles, Heart
} from 'lucide-react';
import { generateMarketingContent } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useForm, ValidationError } from '@formspree/react';

// --- Application Context ---
interface AppContextType {
  appointments: Appointment[];
  leads: Lead[];
  addAppointment: (data: any) => void;
  addLead: (data: any) => void;
  services: Service[];
  updateServiceDescription: (id: string, desc: string) => void;
  doctors: Doctor[];
  testimonials: Testimonial[];
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

// --- Sub-components (in same file for single-file requirement structure, but logically separated) ---

const Layout: React.FC<{ children: React.ReactNode, onViewChange: (view: ViewState) => void }> = ({ children, onViewChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAdmin, setIsAdmin } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-900 text-slate-300 py-2 text-xs md:text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1"><Phone size={14} /> {CLINIC_PHONE}</span>
            <span className="hidden md:flex items-center gap-1"><MapPin size={14} /> {CLINIC_ADDRESS}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="hidden md:inline">Mon-Fri: 9am - 6pm</span>
            <div className="flex space-x-2 border-l border-slate-700 pl-3">
              <a href="https://www.instagram.com/luminamedicaldfw/" target="_blank" rel="noopener noreferrer" className="hover:text-white cursor-pointer">
                <Instagram size={14} />
              </a>
              <a href="https://www.facebook.com/people/Lumina-Medical-Clinic/61584700435468/" target="_blank" rel="noopener noreferrer" className="hover:text-white cursor-pointer">
                <Facebook size={14} />
              </a>
              <a href="https://www.linkedin.com/in/sahbayazdani" target="_blank" rel="noopener noreferrer" className="hover:text-white cursor-pointer">
                <span className="font-bold text-sm">LI</span>
              </a>
            </div>
            {/* Admin Toggle */}
            <button onClick={() => {
              if (isAdmin) {
                setIsAdmin(false);
                onViewChange('landing');
              } else {
                onViewChange('admin');
              }
            }} className="text-xs text-slate-600 hover:text-slate-400 ml-4">
              {isAdmin ? 'Exit Admin' : 'Admin'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewChange('landing')}>
            <img src="/assets/images/lumina.jpg" alt="Lumina Medical Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg shadow-lg shadow-teal-200 object-contain" />
            <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Lumina<span className="text-teal-600">Medical</span></span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#services" className="hover:text-teal-600 transition-colors scroll-link">Treatments</a>
            <a href="#doctors" className="hover:text-teal-600 transition-colors scroll-link">Doctors</a>
            <a href="#results" className="hover:text-teal-600 transition-colors scroll-link">Results</a>
            <a href="#faq" className="hover:text-teal-600 transition-colors scroll-link">FAQs</a>
            <button
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-full transition-all shadow-lg shadow-teal-200 hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl py-4 flex flex-col items-center space-y-4 animate-fade-in">
            <a href="#services" className="text-slate-600 font-medium scroll-link">Treatments</a>
            <a href="#doctors" className="text-slate-600 font-medium scroll-link">Doctors</a>
            <a href="#results" className="text-slate-600 font-medium scroll-link">Results</a>
            <button
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setIsMenuOpen(false);
              }}
              className="bg-teal-600 text-white px-8 py-3 rounded-full w-3/4"
            >
              Book Now
            </button>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4">
          {/* Newsletter and CTA Section */}
          <div className="bg-slate-800 rounded-2xl p-8 mb-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Ready to Start Your Journey?</h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">Book your appointment today and take the first step towards optimal health and wellness.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Book Appointment
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/assets/images/lumina.jpg" alt="Lumina Medical Logo" className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg object-contain" />
                <h3 className="text-lg sm:text-xl font-bold">Lumina<span className="text-teal-400">Medical</span></h3>
              </div>
              <p className="text-sm opacity-70 leading-relaxed">
                Redefining healthcare with premium services, expert specialists, and a patient-first approach.
              </p>
              <div className="flex space-x-4 pt-4">
                <a href="https://www.instagram.com/luminamedicaldfw/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white cursor-pointer">
                  <Instagram size={18} />
                </a>
                <a href="https://www.facebook.com/people/Lumina-Medical-Clinic/61584700435468/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white cursor-pointer">
                  <Facebook size={18} />
                </a>
                <a href="https://www.linkedin.com/in/sahbayazdani" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white cursor-pointer">
                  <span className="font-bold text-sm">LI</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-teal-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Our Doctors</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Primary Care</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">IV Therapy</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Weight Loss</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Hormone Replacement</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-teal-500 shrink-0 mt-0.5" />
                  <span>{CLINIC_ADDRESS}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-teal-500 shrink-0" />
                  <span>{CLINIC_PHONE}</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500 shrink-0">
                    <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
                    <polyline points="3 7 12 13 21 7"></polyline>
                  </svg>
                  <span>info@luminamedical.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock size={18} className="text-teal-500 shrink-0" />
                  <span>Mon-Fri: 9am - 6pm</span>
                  <span>Sat: 10am - 2pm</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Hours and Mini-map */}
          <div className="grid md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-slate-800">
            <div>
              <h5 className="text-white font-semibold mb-3">Office Hours</h5>
              <ul className="space-y-1 text-sm text-slate-400">
                <li className="flex justify-between"><span>Monday - Friday</span> <span>9am - 6pm</span></li>
                <li className="flex justify-between"><span>Saturday</span> <span>10am - 2pm</span></li>
                <li className="flex justify-between"><span>Sunday</span> <span>Closed</span></li>
              </ul>
            </div>
            <div className="text-center">
              <h5 className="text-white font-semibold mb-3">Our Location</h5>
              <div className="bg-slate-800 rounded-lg h-24 flex items-center justify-center">
                <MapPin size={24} className="text-teal-500" />
              </div>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3">Newsletter</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 bg-slate-800 text-white rounded-l-lg focus:outline-none focus:ring-1 focus:ring-teal-500 w-full text-sm"
                />
                <button className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-r-lg text-sm font-medium">
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs opacity-50">
            © {new Date().getFullYear()} {CLINIC_NAME}. All rights reserved.<br />
            powered by BuiltByHer and designed by Bisma with 💖
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Pages ---

const LandingPage: React.FC = () => {
  const { services, doctors, testimonials, addAppointment, addLead } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScrollToSection = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.classList.contains('scroll-link')) {
        e.preventDefault();
        const href = target.getAttribute('href');
        if (href && href.startsWith('#')) {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleScrollToSection as EventListener);
    return () => {
      document.removeEventListener('click', handleScrollToSection as EventListener);
    };
  }, []);

  const handleBooking = (data: any) => {
    // Add to local state management for the admin dashboard
    const newAppt: Appointment = {
      id: Date.now().toString(),
      patientName: data.name || data.firstName,
      email: data.email,
      phone: data.phone,
      serviceId: data.service || data.serviceId,
      date: data.date || data.preferredDateTime,
      status: 'Pending',
      notes: data.notes
    };
    addAppointment(newAppt);

    // Also add as a lead
    addLead({
      id: Date.now().toString(),
      name: data.name || data.firstName,
      email: data.email,
      phone: data.phone,
      interest: services.find(s => s.id === (data.service || data.serviceId))?.title || data.service || 'General',
      source: 'Booking Form',
      status: 'New',
      timestamp: new Date().toISOString()
    });
  };

  const handleLeadCapture = (info: any) => {
    if (info.interest) {
      addLead({
        id: Date.now().toString(),
        name: info.name || 'Website Visitor',
        email: info.email || 'visitor@example.com', // In a real bot, we'd ask for this
        interest: info.interest,
        source: 'Chatbot',
        status: 'New',
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <>
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        services={services}
        onSubmit={handleBooking}
      />
      <Chatbot onLeadCapture={handleLeadCapture} />

      {/* Hero Section with Accessible Parallax Effect */}
      <section className="relative overflow-hidden animate-fade-in h-screen flex items-center" id="home">
        <ParallaxSection className="h-full w-full" image="/assets/images/bg.png.png">
          <div className="absolute inset-0 bg-slate-900 z-0 opacity-80"></div>
          <div className="absolute inset-0 z-0 opacity-40">
             <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              poster="/assets/images/ivf.jpg"
             >
               <source src="/assets/images/ivf.mp4" type="video/mp4" />
               Your browser does not support the video tag.
             </video>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10"></div>

          <div className="container mx-auto px-4 relative z-20 h-full flex items-center">
            <div className="max-w-2xl text-white space-y-6 animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 rounded-full px-4 py-1.5 text-teal-300 text-sm font-medium backdrop-blur-sm animate-fade-in-delay-1 mt-6">
                <ShieldCheck size={16} />
                <span>Licensed Medical Professionals</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight animate-fade-in-delay-2">
                Transform Your Health & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Reclaim Your Vitality</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-xl animate-fade-in-delay-3">
                 At Lumina Medical, we address the root causes of aging, fatigue, and health decline with cutting-edge IV therapy, hormone optimization, and aesthetic treatments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-delay-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-teal-500 hover:bg-teal-600 text-white text-base sm:text-lg font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-custom shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  Book Consultation <ArrowRight size={20} />
                </button>
                <a href="tel:214-267-9109" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-base sm:text-lg font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-custom border border-white/10 flex items-center justify-center transform hover:-translate-y-0.5">
                  Call Us: 214-267-9109
                </a>
              </div>

              <div className="pt-8 flex flex-col gap-2 text-sm text-slate-400 animate-fade-in-delay-2 ml-[3px] pb-8">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => <Star key={i} size={19} fill="currentColor" className="animate-pop-in-delay-2 mr-1" />)}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="text-teal-400 hover:text-teal-300 font-medium transition-colors group flex items-center justify-start"
                >
                  Trusted by Hundreds
                  <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </ParallaxSection>
      </section>

      {/* Stats Banner with Parallax Effect */}
      <ParallaxSection className="py-12" image="/assets/images/bg.png.png">
        <section className="bg-white border-b border-slate-100 animate-fade-in" id="stats">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 stagger-children">
             {[
               { label: 'Happy Clients', val: '500+' },
               { label: 'IV Infusions', val: '2.5k+' },
               { label: 'HRT Success', val: '98%' },
               { label: 'Aesthetic Cases', val: '800+' },
             ].map((stat, i) => (
               <div key={i} className="text-center border-b sm:border-b-0 sm:border-l border-slate-100 pb-4 sm:pb-0 sm:pl-6 first:border-0 first:pl-0 animate-scale-in">
                 <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.val}</div>
                 <div className="text-xs sm:text-sm text-slate-500 uppercase tracking-wide font-medium">{stat.label}</div>
               </div>
             ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* Doctor's Best Services with Accessible Parallax Background */}
      <ParallaxSection className="py-20" image="/assets/images/bg.png.png">
        <div className="container mx-auto px-4" id="services">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">
              <span className="relative inline-block">
                <span className="relative z-10">Dr.</span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500 transform scale-x-100 transition-transform duration-300 origin-left"></span>
              </span>
              <span> Sahba's Premium Services</span>
            </h2>
            <p className="text-slate-600">Experience the highest quality medical treatments designed specifically for your unique health journey</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-children">
            {[
              {
                icon: 'Droplets',
                title: 'IV Therapy',
                desc: 'Customized vitamin and mineral infusions to boost energy, immunity, and recovery. Perfect for athletes, busy professionals, and anyone seeking optimal wellness.'
              },
              {
                icon: 'Activity',
                title: 'Hormone Replacement',
                desc: 'Bioidentical hormone optimization to restore vitality, energy, and balance. Personalized treatment plans for men and women to combat aging naturally.'
              },
              {
                icon: 'Scale',
                title: 'Weight Loss Programs',
                desc: 'Comprehensive GLP-1 programs with personalized nutrition plans and medical supervision. Sustainable results that last a lifetime.'
              },
              {
                icon: 'Heart',
                title: 'Aesthetic Treatments',
                desc: 'Advanced procedures including Botox, fillers, and skin rejuvenation. Natural-looking results that enhance your natural beauty.'
              }
            ].map((service, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center group hover:shadow-xl transition-custom">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-teal-600 group-hover:to-emerald-600 transition-all animate-pop-in">
                  {service.icon === 'Droplets' && <Activity size={24} />}
                  {service.icon === 'Activity' && <Activity size={24} />}
                  {service.icon === 'Scale' && <BarChart3 size={24} />}
                  {service.icon === 'Heart' && <Heart size={24} />}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 animate-fade-in-delay-1">{service.title}</h3>
                <p className="text-slate-600 text-sm animate-fade-in-delay-2">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Services Section with Parallax Effect */}
      <ParallaxSection className="py-20" image="/assets/images/bg.png.png">
        <section className="py-20 bg-slate-50 animate-fade-in" id="more-services">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">
                <span className="relative inline-block">
                  <span className="relative z-10">Medical</span>
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500 transform scale-x-100 transition-transform duration-300 origin-left"></span>
                </span>
                <span> Excellence</span>
              </h2>
              <p className="text-slate-600">Advanced treatments including IV therapy, hormone optimization, weight management, and aesthetic procedures designed by medical experts.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
              {services.map((service) => (
                <div key={service.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-custom overflow-hidden border border-slate-100 animate-scale-in">
                  <div className="h-48 overflow-hidden relative">
                    <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover transition-custom group-hover:scale-110" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm animate-pop-in">
                      {service.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 animate-fade-in-delay-1">{service.title}</h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-3 animate-fade-in-delay-2">{service.description}</p>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 animate-fade-in-delay-3">
                      <span className="text-teal-600 font-semibold text-sm">{service.priceRange}</span>
                      <button onClick={() => setIsModalOpen(true)} className="text-slate-900 hover:text-teal-600 text-sm font-medium flex items-center gap-1 transition-custom">
                        Book <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* Testimonials & Results with Parallax Effect */}
      <ParallaxSection className="py-20" image="/assets/images/bg.png.png">
        <section className="py-20 bg-white animate-fade-in" id="results">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">
              <span className="relative inline-block">
                <span className="relative z-10">Real</span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500 transform scale-x-100 transition-transform duration-300 origin-left"></span>
              </span>
              <span> Results, Real Stories</span>
            </h2>
              <p className="text-slate-600">See how our personalized care has transformed lives and improved health outcomes</p>
            </div>

            {/* Google Reviews Section */}
            <div className="animate-fade-in">
              <div className="elfsight-app-57616c0f-6fb6-40cf-921f-9ceebd66479a" data-elfsight-app-lazy></div>
            </div>

            {/* Before/After Results Section */}
            <div className="mt-16 animate-fade-in">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center animate-slide-up">
              <span className="relative inline-block">
                <span className="relative z-10">Proven</span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500 transform scale-x-100 transition-transform duration-300 origin-left"></span>
              </span>
              <span> Results</span>
            </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center stagger-children">
                <div className="bg-slate-50 p-6 rounded-xl animate-scale-in">
                  <div className="text-3xl font-bold text-teal-600 animate-pop-in">98%</div>
                  <div className="text-sm text-slate-600 animate-fade-in-delay-1">HRT Success Rate</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl animate-scale-in">
                  <div className="text-3xl font-bold text-teal-600 animate-pop-in">95%</div>
                  <div className="text-sm text-slate-600 animate-fade-in-delay-1">Patient Satisfaction</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl animate-scale-in">
                  <div className="text-3xl font-bold text-teal-600 animate-pop-in">12+</div>
                  <div className="text-sm text-slate-600 animate-fade-in-delay-1">Years Experience</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl animate-scale-in">
                  <div className="text-3xl font-bold text-teal-600 animate-pop-in">2.5k+</div>
                  <div className="text-sm text-slate-600 animate-fade-in-delay-1">IV Infusions</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* Doctors with Parallax Effect */}
      <ParallaxSection className="py-20" image="/assets/images/bg.png.png">
        <section className="py-20 bg-white animate-fade-in" id="doctors">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-12 animate-slide-up">
               <div className="text-center max-w-2xl">
                 <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">
                 <span className="relative inline-block">
                   <span className="relative z-10">Meet</span>
                   <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500 transform scale-x-100 transition-transform duration-300 origin-left"></span>
                 </span>
                 <span> Our Medical Experts</span>
               </h2>
                 <p className="text-slate-600">Board-certified physicians specializing in IV therapy, hormone optimization, and aesthetic medicine.</p>
               </div>
               <button className="hidden md:flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition-custom mt-4 md:mt-0 animate-fade-in-delay-1">
                 View All Doctors <ArrowRight size={20} />
               </button>
            </div>

            {/* Highlight Expert Specialists */}
            <div className="flex justify-center mb-12">
              <div className="flex -space-x-4">
                <img src="/assets/images/sahba.png" alt="Dr. Sahba Yazdani" className="w-16 h-16 rounded-full border-4 border-white shadow-lg" />
                <img src="/assets/images/dr.png.jpg" alt="Dr. Olga" className="w-16 h-16 rounded-full border-4 border-white shadow-lg" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 stagger-children">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="flex flex-col md:flex-row bg-slate-50 rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-scale-in">
                  <div className="md:w-2/5 h-64 md:h-auto relative">
                     <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover animate-fade-in" />
                  </div>
                  <div className="p-8 md:w-3/5 flex flex-col justify-center">
                     <div className="text-teal-600 font-medium text-sm mb-1 animate-fade-in-delay-1">{doctor.specialty}</div>
                     <h3 className="text-2xl font-bold text-slate-900 mb-4 animate-fade-in-delay-2">{doctor.name}</h3>
                     <div className="text-slate-600 text-sm mb-6 leading-relaxed animate-fade-in-delay-3">
                       {doctor.bio}
                       <details className="mt-3">
                         <summary className="text-teal-600 cursor-pointer font-medium hover:underline">
                           View Full Bio
                         </summary>
                         <div className="mt-3 text-slate-600">
                           Dr. {doctor.name.split(' ')[1]} brings {doctor.bio.includes('12') ? 'over 12 years' : 'extensive'} of experience in {doctor.specialty.toLowerCase()}.
                           Board-certified with advanced training in personalized care approaches, {doctor.bio.includes('Dr. Williams') ? 'she' : 'he'} believes in treating the whole person, not just symptoms.
                           {doctor.bio.includes('Dr. Williams') ? 'Her' : 'His'} approach combines evidence-based medicine with compassionate care to achieve optimal health outcomes.
                         </div>
                       </details>
                     </div>
                     <div className="flex flex-wrap gap-2 mb-6 animate-fade-in-delay-3">
                       {doctor.qualifications.map((q, i) => (
                         <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-500 animate-pop-in">{q}</span>
                       ))}
                     </div>
                     <button onClick={() => setIsModalOpen(true)} className="self-start bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-custom animate-fade-in-delay-2">
                       Schedule Visit
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* FAQ with Parallax Effect */}
      <ParallaxSection className="py-20" image="/assets/images/bg.png.png">
        <section className="py-20 bg-slate-50 animate-fade-in" id="faq">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12 animate-slide-up">
              <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
              <span className="relative inline-block">
                <span className="relative z-10">Frequently</span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500 transform scale-x-100 transition-transform duration-300 origin-left"></span>
              </span>
              <span> Asked Questions</span>
            </h2>
              <p className="text-slate-600">Everything you need to know about our clinic and procedures.</p>
            </div>
            <div className="space-y-4 stagger-children">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-scale-in">
                  <details className="group">
                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-slate-900">
                      <span className="animate-fade-in-delay-1">{faq.question}</span>
                      <span className="transition group-open:rotate-180 animate-pop-in">
                        <ChevronRight size={20} className="text-slate-400" />
                      </span>
                    </summary>
                    <div className="text-slate-600 px-6 pb-6 text-sm leading-relaxed border-t border-slate-50 pt-4 animate-fade-in-delay-2">
                      {faq.answer}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* Contact Section with Parallax Effect */}
      <ParallaxSection className="py-20" image="/assets/images/bg.png.png">
        <section className="py-20 bg-slate-50 animate-fade-in" id="contact">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center animate-slide-up">
              <span className="relative inline-block">
                <span className="relative z-10">Schedule</span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500 transform scale-x-100 transition-transform duration-300 origin-left"></span>
              </span>
              <span> Your Consultation</span>
            </h2>
              <p className="text-slate-600 text-center mb-12 animate-fade-in-delay-1">Contact our medical team to learn about IV therapy, hormone optimization, weight loss, and aesthetic treatments</p>

              <div className="grid md:grid-cols-2 gap-12 stagger-children">
                {/* Contact Information */}
                <div className="animate-scale-in">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 animate-fade-in-delay-1 text-center md:text-left">
                  <span className="relative inline-block">
                    <span className="relative z-10">Get</span>
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500 transform scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                  <span> In Touch</span>
                </h3>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4 animate-fade-in-delay-2">
                      <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center animate-pop-in">
                        <Phone size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">Call Us</div>
                        <div className="text-slate-600">{CLINIC_PHONE}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 animate-fade-in-delay-3">
                      <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center animate-pop-in">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">Visit Us</div>
                        <div className="text-slate-600">{CLINIC_ADDRESS}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 animate-fade-in-delay-3">
                      <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center animate-pop-in">
                        <Clock size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">Hours</div>
                        <div className="text-slate-600">Monday-Friday: 9am - 6pm</div>
                        <div className="text-slate-600">Saturday: 10am - 2pm</div>
                      </div>
                    </div>
                  </div>

                  {/* Google Maps Embed */}
                  <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 animate-scale-in">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.310960755295!2d-118.40027038481958!3d34.09037608059101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bb7a1f0ad529%3A0x12143c1dc6ebc7b1!2sBeverly%20Hills%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1650000000000"
                      width="100%"
                      height="200"
                      style={{border:0}}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Google Maps Location"
                    ></iframe>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="animate-scale-in">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 animate-fade-in-delay-1 text-center md:text-left">
                    <span className="relative inline-block">
                      <span className="relative z-10">Book</span>
                      <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500 transform scale-x-100 transition-transform duration-300 origin-left"></span>
                    </span>
                    <span> Your Appointment</span>
                  </h3>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </ParallaxSection>
    </>
  );
};

const AdminDashboard: React.FC = () => {
  const { appointments, leads, services, updateServiceDescription } = useAppContext();
  const [activeSection, setActiveSection] = useState<AdminSection>('appointments');
  const [aiGeneratingId, setAiGeneratingId] = useState<string | null>(null);

  const handleAiGen = async (id: string, title: string) => {
    setAiGeneratingId(id);
    const newDesc = await generateMarketingContent(title, 'service_desc');
    if (newDesc && !newDesc.includes("fallback")) {
      updateServiceDescription(id, newDesc);
    } else {
      console.warn("Using fallback content - AI service not available");
    }
    setAiGeneratingId(null);
  };

  return (
    <div className="flex h-[calc(100vh-60px)] bg-slate-100">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-400 flex flex-col">
        <div className="p-6 border-b border-slate-800">
           <h2 className="text-white font-bold text-lg tracking-wide">Admin Portal</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveSection('appointments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'appointments' ? 'bg-teal-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Calendar size={20} /> Appointments
            {appointments.filter(a => a.status === 'Pending').length > 0 &&
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{appointments.filter(a => a.status === 'Pending').length}</span>
            }
          </button>
          <button
            onClick={() => setActiveSection('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'leads' ? 'bg-teal-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Users size={20} /> Leads
          </button>
          <button
            onClick={() => setActiveSection('services')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'services' ? 'bg-teal-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <FileText size={20} /> Services
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        {/* Appointments Table */}
        {activeSection === 'appointments' && (
          <div className="animate-fade-in space-y-6">
            <h1 className="text-2xl font-bold text-slate-800 animate-slide-up">Appointment Requests</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-scale-in">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 border-b border-slate-100">
                   <tr>
                     <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Patient</th>
                     <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Service</th>
                     <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                     <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                     <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {appointments.map(apt => (
                      <tr key={apt.id} className="hover:bg-slate-50/50 transition-custom animate-fade-in">
                        <td className="p-4">
                          <div className="font-medium text-slate-900">{apt.patientName}</div>
                          <div className="text-xs text-slate-500">{apt.email}</div>
                        </td>
                        <td className="p-4 text-slate-700">{services.find(s => s.id === apt.serviceId)?.title}</td>
                        <td className="p-4 text-slate-700">{apt.date}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <button className="text-teal-600 hover:text-teal-800 text-sm font-medium transition-custom">Manage</button>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr><td colSpan={5} className="p-8 text-center text-slate-400 animate-fade-in">No appointments found.</td></tr>
                    )}
                 </tbody>
               </table>
            </div>
          </div>
        )}

        {/* Leads Table */}
        {activeSection === 'leads' && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center animate-slide-up">
              <h1 className="text-2xl font-bold text-slate-800">Lead Database</h1>
              <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm flex items-center gap-2 text-slate-600 transition-custom">
                <Search size={14} /> Search leads...
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-scale-in">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 border-b border-slate-100">
                   <tr>
                     <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Name</th>
                     <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Interest</th>
                     <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Source</th>
                     <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                     <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-slate-50/50 transition-custom animate-fade-in">
                        <td className="p-4 font-medium text-slate-900">{lead.name}</td>
                        <td className="p-4 text-slate-700">{lead.interest}</td>
                        <td className="p-4 text-slate-500 text-sm">{lead.source}</td>
                        <td className="p-4 text-slate-500 text-sm">{new Date(lead.timestamp).toLocaleDateString()}</td>
                        <td className="p-4">
                           <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-medium animate-pop-in">{lead.status}</span>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
          </div>
        )}

        {/* Services Manager with AI */}
        {activeSection === 'services' && (
          <div className="animate-fade-in space-y-6">
            <h1 className="text-2xl font-bold text-slate-800 animate-slide-up">Service Management</h1>
            <div className="grid grid-cols-1 gap-6 stagger-children">
               {services.map(service => (
                 <div key={service.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 animate-scale-in">
                    <img src={service.imageUrl} className="w-24 h-24 rounded-xl object-cover animate-fade-in" alt="" />
                    <div className="flex-1 space-y-3">
                       <div className="flex justify-between items-start animate-fade-in-delay-1">
                         <h3 className="font-bold text-lg text-slate-900">{service.title}</h3>
                         <span className="text-teal-600 font-semibold">{service.priceRange}</span>
                       </div>
                       <textarea
                          className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 transition-custom"
                          rows={3}
                          value={service.description}
                          readOnly
                       />
                       <div className="flex gap-2 animate-fade-in-delay-2">
                         <button
                           onClick={() => handleAiGen(service.id, service.title)}
                           disabled={aiGeneratingId === service.id}
                           className="flex items-center gap-2 text-xs font-semibold bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200 transition-custom disabled:opacity-50"
                         >
                           {aiGeneratingId === service.id ? 'Generating...' : <><Sparkles size={14} /> AI Rewrite Description</>}
                         </button>
                         <button className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-custom">
                           Edit Details
                         </button>
                       </div>
                    </div>
                 </div>
               ))}
               <button className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 hover:border-teal-500 hover:text-teal-600 transition-custom font-medium animate-scale-in">
                 <Plus size={20} /> Add New Service
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- App Container ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [isAdmin, setIsAdmin] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [leads, setLeads] = useState<Lead[]>([
    { id: 'l1', name: 'Alice Smith', email: 'alice@test.com', interest: 'Dental Implants', source: 'Chatbot', status: 'New', timestamp: new Date().toISOString() },
    { id: 'l2', name: 'Bob Jones', email: 'bob@test.com', interest: 'Weight Loss', source: 'Contact Form', status: 'Contacted', timestamp: new Date(Date.now() - 86400000).toISOString() }
  ]);
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);

  const addAppointment = (data: Appointment) => {
    setAppointments(prev => [data, ...prev]);
  };

  const addLead = (data: Lead) => {
    setLeads(prev => [data, ...prev]);
  };

  const updateServiceDescription = (id: string, desc: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, description: desc } : s));
  };

  return (
    <AppContext.Provider value={{
      appointments, leads, addAppointment, addLead,
      services, updateServiceDescription,
      doctors: MOCK_DOCTORS, testimonials: MOCK_TESTIMONIALS,
      isAdmin, setIsAdmin
    }}>
      <Layout onViewChange={setView}>
        {view === 'landing' ? <LandingPage /> :
          !isAdmin ? <AdminAuth onLogin={(email, password) => setIsAdmin(true)} /> : <AdminDashboard />}
        <GoogleReviewsScript />
      </Layout>
    </AppContext.Provider>
  );
};

// Elfsight Google Reviews Script
const GoogleReviewsScript: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

// Contact Form Component using Formspree
const ContactForm: React.FC = () => {
  const [state, handleSubmit] = useForm("xzddpydl");
  if (state.succeeded) {
    return <p className="text-center text-green-600 font-medium">Thank you! Your appointment request has been received. We'll contact you shortly.</p>;
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="animate-fade-in-delay-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-custom"
            placeholder="John"
            required
          />
        </div>
        <div className="animate-fade-in-delay-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-custom"
            placeholder="Doe"
            required
          />
        </div>
      </div>

      <div className="animate-fade-in-delay-3">
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-custom"
          placeholder="john@example.com"
          required
        />
        <ValidationError
          prefix="Email"
          field="email"
          errors={state.errors}
        />
      </div>

      <div className="animate-fade-in-delay-3">
        <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
        <input
          type="tel"
          name="phone"
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-custom"
          placeholder="(555) 000-0000"
          required
        />
      </div>

      <div className="animate-fade-in-delay-3">
        <label className="block text-sm font-medium text-slate-700 mb-1">Service Interested In</label>
        <select name="service" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-custom">
          <option value="">Select a service</option>
          <option value="primary-care">Primary Care</option>
          <option value="weight-loss">Weight Loss</option>
          <option value="hrt">Hormone Replacement Therapy</option>
          <option value="iv-therapy">IV Therapy</option>
        </select>
      </div>

      <div className="animate-fade-in-delay-3">
        <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date & Time</label>
        <input
          type="datetime-local"
          name="preferredDateTime"
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-custom"
        />
      </div>

      <div className="animate-fade-in-delay-3">
        <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
        <textarea
          name="message"
          rows={3}
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-custom resize-none"
          placeholder="Tell us about your health goals..."
        ></textarea>
      </div>

      <input type="hidden" name="_subject" value="New Appointment Request from Lumina Medical Website" />
      <input type="hidden" name="_replyto" value="info@luminamedical.com" />

      <button
        type="submit"
        disabled={state.submitting}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-teal-200 hover:shadow-xl transition-custom transform hover:-translate-y-0.5 disabled:opacity-70"
      >
        {state.submitting ? 'Sending...' : 'Submit Appointment Request'}
      </button>
    </form>
  );
};

export default App;