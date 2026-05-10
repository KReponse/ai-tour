// src/pages/AIPlanner.jsx - Add Link import
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Add this import
import { Bot, Calendar, MapPin, Users, Sparkles, Send } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent } from '../components/ui/Card';

// Rest of the code remains the same...

const AIPlanner = () => {
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: '',
    interests: []
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const interests = ['Adventure', 'Culture', 'Food', 'Nature', 'Shopping', 'Nightlife'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setRecommendations([
        {
          day: 1,
          activities: ['Arrival and hotel check-in', 'City orientation tour', 'Welcome dinner']
        },
        {
          day: 2,
          activities: ['Historical sites tour', 'Local cuisine experience', 'Evening cultural show']
        },
        {
          day: 3,
          activities: ['Adventure activities', 'Shopping at local markets', 'Sunset cruise']
        }
      ]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <Bot className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          AI Travel Planner
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Let our AI create your perfect itinerary based on your preferences
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Destination</label>
            <Input
              placeholder="Where do you want to go?"
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Number of Travelers</label>
              <Input
                type="number"
                min="1"
                value={formData.travelers}
                onChange={(e) => setFormData({...formData, travelers: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Budget (USD)</label>
              <Input
                type="text"
                placeholder="Your budget"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Interests</label>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => {
                    const newInterests = formData.interests.includes(interest)
                      ? formData.interests.filter(i => i !== interest)
                      : [...formData.interests, interest];
                    setFormData({...formData, interests: newInterests});
                  }}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    formData.interests.includes(interest)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Planning Your Trip...
              </>
            ) : (
              <>
                Generate Itinerary
                <Send className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      </Card>

      {recommendations.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your AI-Generated Itinerary</h2>
          {recommendations.map((day) => (
            <Card key={day.day} className="p-6">
              <h3 className="text-xl font-semibold mb-4">Day {day.day}</h3>
              <ul className="space-y-2">
                {day.activities.map((activity, idx) => (
                  <li key={idx} className="flex items-center text-gray-600 dark:text-gray-300">
                    <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                    {activity}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
          <div className="flex justify-center">
            <Link to="/booking">
              <Button variant="primary" size="lg">
                Book This Trip
                <Calendar className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPlanner;