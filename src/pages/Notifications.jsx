// src/pages/Notifications.jsx
import React from 'react';
import { Bell, Calendar, Star, Gift } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'booking',
      icon: Calendar,
      title: 'Booking Confirmed',
      message: 'Your trip to Paris has been confirmed!',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'review',
      icon: Star,
      title: 'New Review',
      message: 'Someone reviewed your trip to Bali',
      time: '1 day ago',
      read: true
    },
    {
      id: 3,
      type: 'offer',
      icon: Gift,
      title: 'Special Offer',
      message: '20% off on your next booking!',
      time: '3 days ago',
      read: true
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Notifications</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Stay updated with your travel activities
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card key={notification.id} className={`transition ${!notification.read ? 'border-l-4 border-l-blue-600' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${!notification.read ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  <notification.icon className={`w-5 h-5 ${!notification.read ? 'text-blue-600' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{notification.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    {notification.message}
                  </p>
                  <span className="text-xs text-gray-400">{notification.time}</span>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notifications;