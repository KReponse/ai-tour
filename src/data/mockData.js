// src/data/mockData.js
export const destinations = [
  {
    id: 1,
    name: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    price: 899,
    rating: 4.8,
    duration: '5 days'
  },
  {
    id: 2,
    name: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    price: 699,
    rating: 4.9,
    duration: '7 days'
  },
  {
    id: 3,
    name: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    price: 1299,
    rating: 4.9,
    duration: '6 days'
  },
  {
    id: 4,
    name: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    price: 999,
    rating: 4.7,
    duration: '4 days'
  }
];

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    text: 'AI Tour made planning my vacation so easy! The AI planner created the perfect itinerary.',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    text: 'Amazing experience! Found the best deals and the booking process was seamless.',
    rating: 5
  }
];

export const trips = [
  {
    id: 1,
    destination: 'Paris, France',
    startDate: '2024-03-15',
    endDate: '2024-03-20',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'
  },
  {
    id: 2,
    destination: 'Bali, Indonesia',
    startDate: '2024-02-10',
    endDate: '2024-02-17',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'
  }
];