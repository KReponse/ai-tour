// src/pages/Reviews.jsx
import React from 'react';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      user: 'Emily Watson',
      destination: 'Paris, France',
      rating: 5,
      comment: 'Amazing experience! The AI planner created the perfect itinerary.',
      date: '2024-01-15',
      helpful: 24
    },
    {
      id: 2,
      user: 'David Kim',
      destination: 'Tokyo, Japan',
      rating: 4,
      comment: 'Great recommendations and smooth booking process.',
      date: '2024-01-10',
      helpful: 18
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-5 space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-14 animate-fade-in pb-20 md:pb-6 overflow-x-hidden">

      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Traveler Reviews</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Read what others say about their experiences
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{review.user}</h3>
                  <p className="text-sm text-gray-500">{review.destination}</p>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">{review.rating}</span>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{review.comment}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{review.date}</span>
                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">Helpful ({review.helpful})</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reviews;