import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle } from 'lucide-react';
import { useToast } from '../components/Toast';

export const Contact = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please fill all required fields', 'error');
      return;
    }
    setSubmitted(true);
    addToast('Your message has been sent successfully!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Contact CompareKart Support
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Have feedback on a product comparison or questions about store pricing? We're here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Form (7 cols) */}
        <div className="md:col-span-7 bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-500" />
            Send Us a Message
          </h3>

          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white">Message Received!</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Thank you for contacting us. A member of our support team will get back to you within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="text-xs font-bold text-primary-600 hover:underline pt-2 block"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Aarav Sharma"
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="aarav@example.com"
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Question about product comparison"
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you today?"
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & FAQs (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Quick Contacts</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-500 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-100">Email Support</p>
                  <p className="text-gray-400">support@comparekart.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-100">Helpline</p>
                  <p className="text-gray-400">1800-COMPARE (Toll Free, 9AM-8PM)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-100">Headquarters</p>
                  <p className="text-gray-400">Indiranagar 100ft Road, Bengaluru, Karnataka, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ Box */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Frequently Asked</h3>
            <div className="space-y-2 text-xs">
              <details className="cursor-pointer group">
                <summary className="font-bold text-gray-800 dark:text-gray-200 list-none flex justify-between items-center">
                  <span>How accurate is store price comparison?</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-500 mt-1">Our system aggregates verified live prices from authorized e-retailers.</p>
              </details>

              <details className="cursor-pointer group pt-2 border-t border-gray-100 dark:border-slate-700">
                <summary className="font-bold text-gray-800 dark:text-gray-200 list-none flex justify-between items-center">
                  <span>Is payment processing real?</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-500 mt-1">No, checkout is in demonstration mode for MERN course evaluation.</p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
