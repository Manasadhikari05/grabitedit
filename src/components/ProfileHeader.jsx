import { Edit2, Briefcase, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function ProfileHeader({ user }) {
  return (
    <div className="relative">
      {/* Gradient Header */}
      <div className="h-48 w-full bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 rounded-t-3xl relative">
        <button className="absolute top-6 right-6 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors">
          <Edit2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Profile Content */}
      <div className="bg-white rounded-b-3xl px-8 pb-8">
        {/* Avatar */}
        <div className="flex items-end justify-between -mt-16 mb-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
          />
        </div>

        {/* User Info */}
        <div className="mb-6">
          <h1 className="text-gray-900 mb-1">{user.name}</h1>
          <p className="text-gray-600 mb-1">{user.title}</p>
          <p className="text-gray-500">{user.location}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <Button className="bg-gray-900 hover:bg-gray-800">Edit Profile</Button>
          <Button variant="outline">Settings</Button>
          <Button variant="outline" onClick={() => console.log('Open my posts')}>My Posts</Button>
        </div>

        {/* Current Role & Skills */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase className="w-5 h-5" />
              <span>Current role</span>
            </div>
            <span className="text-gray-900">{user.currentRole}</span>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Star className="w-5 h-5" />
              <span>Skills</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-gray-100 text-gray-900 hover:bg-gray-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}