// src/pages/RequestTrip.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Calendar, Users, MapPin, DollarSign, FileText, Star } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const RequestTrip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: '',
    accommodation: 'standard',
    specialRequests: '',
    preferences: []
  });

  const [submitted, setSubmitted] = useState(false);

  const preferences = ['Adventure', 'Relaxation', 'Culture', 'Food', 'Shopping', 'Nature', 'Nightlife', 'Family-friendly'];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit request logic
    console.log('Trip request:', formData);
    setSubmitted(true);
    setTimeout(() => {
      navigate('/trips');
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Request Sent!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Our travel experts will review your request and get back to you within 24 hours.
          </p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Request a Custom Trip</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Tell us your preferences and we'll create the perfect itinerary for you
        </p>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Dream Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Where do you want to go?"
                  className="pl-10"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="date"
                    className="pl-10"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="date"
                    className="pl-10"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Number of Travelers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="number"
                    min="1"
                    className="pl-10"
                    value={formData.travelers}
                    onChange={(e) => setFormData({...formData, travelers: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Budget (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Your budget"
                    className="pl-10"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Accommodation Preference</label>
              <select
                value={formData.accommodation}
                onChange={(e) => setFormData({...formData, accommodation: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              >
                <option value="budget">Budget / Hostel</option>
                <option value="standard">Standard Hotel (3-4 star)</option>
                <option value="luxury">Luxury Hotel (5 star)</option>
                <option value="resort">Resort / Villa</option>
                <option value="boutique">Boutique Hotel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Travel Preferences</label>
              <div className="flex flex-wrap gap-2">
                {preferences.map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => {
                      const newPrefs = formData.preferences.includes(pref)
                        ? formData.preferences.filter(p => p !== pref)
                        : [...formData.preferences, pref];
                      setFormData({...formData, preferences: newPrefs});
                    }}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      formData.preferences.includes(pref)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Special Requests</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  rows="4"
                  placeholder="Any specific requirements or preferences?"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestTrip;