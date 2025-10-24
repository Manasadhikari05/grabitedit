// src/components/ProfileDropdown.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

/**
 * user prop: This component expects a 'user' object with:
 * - user.name (e.g., "Manas Adhikari")
 * - user.email (e.g., "manas@example.com")
 * - user.profileImage (e.g., "http://.../avatar.jpg")
 *
 * onLogout: A function to call when the logout button is clicked.
 */
function ProfileDropdown({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate avatar URL if no profile image
  const getAvatarUrl = () => {
    if (user?.profileImage) {
      return user.profileImage;
    }
    if (user?.name) {
      return createAvatar(lorelei, {
        seed: user.name,
        size: 64,
        backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
      }).toDataUri();
    }
    return null;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 1. The Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-green-500 cursor-pointer"
      >
        <span className="sr-only">Open user menu</span>
        <Avatar className="h-9 w-9">
          <AvatarImage src={getAvatarUrl()} alt={user?.name || 'User avatar'} />
          <AvatarFallback>
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
          </AvatarFallback>
        </Avatar>
      </button>

      {/* 2. The Dropdown Menu */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
          {/* User Info Header */}
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {user?.email || 'View Profile'}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              My Profile
            </Link>

            <Link
              to="/discussions"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              My Posts
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;