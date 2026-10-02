import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-primary-700 to-primary-950 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MessageCircle className="w-14 h-14 mx-auto mb-4 text-accent-400" />
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-lg text-primary-100">
            Have questions about RexMaths Brain? We're here to help you and your child succeed.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <p className="text-gray-600 mb-8">
                Reach out to us through any of the channels below. Whether you're a parent with
                questions about registration, a teacher interested in our curriculum, or a student
                needing help — we're here for you.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Phone, label: 'Phone', value: '+234 800 000 0000', color: 'bg-primary-500' },
                  { icon: Mail, label: 'Email', value: 'support@rexmathsbrain.com', color: 'bg-accent-500' },
                  { icon: MapPin, label: 'Address', value: 'Lagos, Nigeria', color: 'bg-success-500' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                      <div className={`inline-flex p-3 ${item.color} rounded-xl`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 font-medium">{item.label}</div>
                        <div className="text-lg font-semibold text-gray-900">{item.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              {submitted && (
                <div className="bg-success-50 border border-success-200 text-success-800 rounded-xl p-4 mb-6 animate-slide-down">
                  Thank you! Your message has been sent. We'll get back to you soon.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
