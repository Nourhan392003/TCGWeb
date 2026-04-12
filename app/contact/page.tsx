'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const COMPANY_DATA = {
  email: 'hatartcg@gmail.com',
  phone: '+966562464664',
  location: 'Riyadh, Saudi Arabia',
  workingHours: 'Sunday - Thursday, 9 AM - 6 PM',
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = useMutation(api.contact.sendContactEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      await sendEmail(formData);
      toast.success('Message sent! We will reply within 24 hours.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Hero */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#0a1628] via-[#1a2d47] to-[#0a1628]">
        <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Contact Us</h1>
          <p className="text-gray-400 mt-2">We'd love to hear from you</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          <div className="bg-[#0d1f35] rounded-xl p-8 border border-[#1a3050]">
            <h2 className="text-2xl font-bold text-white mb-6">Send Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-[#0a1628] border border-[#1a3050] rounded-lg text-white placeholder-gray-500 focus:border-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-[#0a1628] border border-[#1a3050] rounded-lg text-white placeholder-gray-500 focus:border-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 bg-[#0a1628] border border-[#1a3050] rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 resize-vertical"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-500 text-black font-bold py-4 px-6 rounded-lg hover:bg-yellow-400 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? 'Sending...' : 'Send Message'}
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-[#0d1f35] rounded-xl p-8 border border-[#1a3050]">
            <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Email</h3>
                  <a href={`mailto:${COMPANY_DATA.email}`} className="text-yellow-400 hover:text-yellow-300">
                    {COMPANY_DATA.email}
                  </a>
                  <p className="text-gray-500 text-sm mt-1">Reply within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Phone</h3>
                  <a href={`tel:${COMPANY_DATA.phone}`} className="text-yellow-400 hover:text-yellow-300">
                    {COMPANY_DATA.phone}
                  </a>
                  <p className="text-gray-500 text-sm mt-1">Sun-Thu 9AM-6PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}