// src/pages/Trips.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import Card, { CardImage, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { trips } from '../data/mockData';

const Trips = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingTrips = trips.filter(trip => trip.status === 'upcoming');
  const pastTrips = trips.filter(trip => trip.status === 'completed');

  const TripCard = ({ trip }) => (
    <Card hover>
      <CardImage src={trip.image} alt={trip.destination} />
      <CardContent>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold">{trip.destination}</h3>
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {trip.startDate} - {trip.endDate}
            </span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))} days
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {trip.status === 'upcoming' ? (
            <>
              <Button variant="primary" size="sm" className="flex-1">
                View Details
              </Button>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="sm" className="flex-1">
              Write a Review
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-5 space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-14 animate-fade-in pb-20 md:pb-6 overflow-x-hidden">

      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">My Trips</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your upcoming and past adventures
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === 'upcoming'
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Upcoming
          {activeTab === 'upcoming' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === 'past'
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Past Trips
          {activeTab === 'past' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
      </div>

      {/* Trip List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'upcoming' ? (
          upcomingTrips.length > 0 ? (
            upcomingTrips.map(trip => <TripCard key={trip.id} trip={trip} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No upcoming trips</h3>
              <p className="text-gray-500 mb-4">Start planning your next adventure</p>
              <Link to="/explore">
                <Button variant="primary">Explore Destinations</Button>
              </Link>
            </div>
          )
        ) : (
          pastTrips.length > 0 ? (
            pastTrips.map(trip => <TripCard key={trip.id} trip={trip} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No past trips yet</h3>
              <p className="text-gray-500">Your completed trips will appear here</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Trips;