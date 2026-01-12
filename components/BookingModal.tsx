import React, { useState } from 'react';
import { X, Calendar, User, Phone, Mail, FileText } from 'lucide-react';
import { Service } from '../types';
import { useForm, ValidationError } from '@formspree/react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  onSubmit: (data: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, services, onSubmit }) => {
  const [state, handleSubmit] = useForm("xzddpydl");

  if (!isOpen) return null;

  if (state.succeeded) {
    setTimeout(() => {
      onClose();
    }, 3000);
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-scale-in">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-custom"
          >
            <X size={20} />
          </button>

          <div className="p-8">
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pop-in">
                <Calendar size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 animate-fade-in-delay-1">Request Received!</h3>
              <p className="text-slate-600 animate-fade-in-delay-2">Thank you! Your appointment request has been received. We'll contact you shortly.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-custom"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="mb-6 animate-slide-up">
            <h3 className="text-2xl font-bold text-slate-900">Book Appointment</h3>
            <p className="text-slate-500 text-sm mt-1">Take the first step towards a better you.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 animate-fade-in-delay-1">
                    <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        required
                        type="text"
                        name="name"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-custom"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 animate-fade-in-delay-2">
                    <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Phone</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        required
                        type="tel"
                        name="phone"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-custom"
                        placeholder="(555) 000-0000"
                      />
                    </div>
                  </div>
              </div>

              <div className="space-y-1 animate-fade-in-delay-2">
                <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    required
                    type="email"
                    name="email"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-custom"
                    placeholder="john@example.com"
                  />
                  <ValidationError
                    prefix="Email"
                    field="email"
                    errors={state.errors}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 animate-fade-in-delay-3">
                    <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Treatment</label>
                    <select
                      required
                      name="service"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-custom appearance-none"
                    >
                      <option value="">Select Service</option>
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                </div>
                <div className="space-y-1 animate-fade-in-delay-3">
                    <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Preferred Date</label>
                    <input
                      required
                      type="date"
                      name="date"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-custom"
                    />
                </div>
              </div>

              <div className="space-y-1 animate-fade-in-delay-3">
                <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Notes (Optional)</label>
                <div className="relative">
                  <FileText size={16} className="absolute left-3 top-3 text-slate-400" />
                  <textarea
                    rows={2}
                    name="notes"
                    placeholder="Any specific concerns or questions?"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-custom resize-none"
                  />
                </div>
              </div>
            </div>

            <input type="hidden" name="_subject" value="New Appointment Request from Lumina Medical Booking Modal" />
            <input type="hidden" name="_replyto" value="bismagondal786@gmail.com" />

            <button
              type="submit"
              disabled={state.submitting}
              className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-teal-200 hover:shadow-xl transition-custom transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              {state.submitting ? 'Sending...' : 'Confirm Request'}
            </button>
            <p className="text-xs text-center text-slate-400 mt-4 animate-fade-in-delay-3">
              By booking, you agree to our Terms of Service. No payment required now.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};