// src/pages/Profile.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Award, Settings, LogOut, Edit2 } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
const { user, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <CardContent className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={
  user?.avatar ||
  'https://ui-avatars.com/api/?name=' +
    user?.fullName
}
                alt={user?.fullName}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white dark:border-gray-800"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{user.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600 dark:text-gray-300">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">{user?.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{user?.country}</span>
                </div>
              </div>
            </div>
            
            <Link to="/edit-profile">
              <Button variant="outline">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
          <div className="text-2xl font-bold text-blue-600">{user?.stats?.trips || 0}</div>
          <div className="text-sm text-gray-500">Trips</div>
        </div>
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
          <div className="text-2xl font-bold text-blue-600">{user?.stats?.reviews || 0}</div>
          <div className="text-sm text-gray-500">Reviews</div>
        </div>
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
          <div className="text-2xl font-bold text-blue-600">{user?.stats?.photos || 0}</div>
          <div className="text-sm text-gray-500">Photos</div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Account Settings</h2>
        
        <Card>
          <CardContent className="divide-y divide-gray-200 dark:divide-gray-700">
            <Link to="/edit-profile" className="flex items-center justify-between py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-4 -mx-4 transition">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 text-gray-500" />
                <span>Personal Information</span>
              </div>
              <Edit2 className="w-4 h-4 text-gray-400" />
            </Link>
            
            <Link to="/settings" className="flex items-center justify-between py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-4 -mx-4 transition">
              <div className="flex items-center">
                <Settings className="w-5 h-5 mr-3 text-gray-500" />
                <span>Preferences</span>
              </div>
              <Settings className="w-4 h-4 text-gray-400" />
            </Link>
            
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-3 text-gray-500" />
                <span>Membership</span>
              </div>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-full">
                Premium Member
              </span>
            </div>
            
           <button
  onClick={logout}
  className="flex items-center justify-between w-full py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-4 -mx-4 transition text-red-600"
>
  <div className="flex items-center">
    <LogOut className="w-5 h-5 mr-3" />
    <span>Sign Out</span>
  </div>
</button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;