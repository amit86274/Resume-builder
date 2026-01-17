
import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="bg-green-50 border border-green-200 rounded-3xl p-12 inline-block">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Message Sent!</h2>
          <p className="text-gray-600">Thank you for reaching out. Our support team will get back to you within 24 hours.</p>
          <button 
            onClick={() => setSubmitted(false)}
            className="mt-8 text-blue-600 font-bold hover:underline"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-600 mb-10">
              Have a question about our templates or need help with your subscription? We're here to help.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-blue-600 p-3 rounded-xl text-white mr-4">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email Us</h4>
                  <p className="text-gray-600">support@resumaster.ai</p>
                  <p className="text-xs text-gray-400 mt-1">Response time: &lt; 24 hours</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-600 p-3 rounded-xl text-white mr-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Live Chat</h4>
                  <p className="text-gray-600">Available Mon-Fri, 9am - 6pm IST</p>
                  <p className="text-xs text-gray-400 mt-1">Available for Pro users</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition text-black" placeholder="Rahul Sharma" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email Address</label>
                  <input required type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition text-black" placeholder="rahul@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Subject</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white text-black">
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Billing & Payment</option>
                  <option>Templates Request</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Message</label>
                <textarea required rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition text-black" placeholder="How can we help you today?"></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center hover:bg-blue-700 transition shadow-lg shadow-blue-100"
              >
                Send Message <Send className="w-4 h-4 ml-2" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
