import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import SelectLib from 'react-select';
import { createAvatar } from '@dicebear/core';
import { lorelei, avataaars } from '@dicebear/collection';
import * as d3 from 'd3';
import {
  User,
  MapPin,
  Twitter,
  Linkedin,
  Dribbble,
  CheckCircle2,
  Award,
  Calendar,
  ExternalLink,
  ChevronRight,
  Edit3,
  Camera,
  Save,
  X,
  Upload,
  Code,
  Trophy,
  Trash2,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Briefcase,
  FileText
} from "lucide-react";
import { Navbar } from "./Navbar";
import ProfileDropdown from "./ProfileDropdown";

export function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    location: '',
    bio: '',
    twitter: '',
    linkedin: '',
    dribbble: '',
    leetcode: '',
    codeforces: '',
    currentCompany: '',
    currentPosition: '',
    experience: '',
    workHistory: [],
    skills: [],
    certificates: []
  });
  const fileInputRef = useRef(null);
  const skillsChartRef = useRef(null);
  const experienceChartRef = useRef(null);

  // Comprehensive list of world cities
  const worldCities = [
    // North America - USA
    { value: 'New York, NY, USA', label: 'New York, NY, USA' },
    { value: 'Los Angeles, CA, USA', label: 'Los Angeles, CA, USA' },
    { value: 'Chicago, IL, USA', label: 'Chicago, IL, USA' },
    { value: 'Houston, TX, USA', label: 'Houston, TX, USA' },
    { value: 'Phoenix, AZ, USA', label: 'Phoenix, AZ, USA' },
    { value: 'Philadelphia, PA, USA', label: 'Philadelphia, PA, USA' },
    { value: 'San Antonio, TX, USA', label: 'San Antonio, TX, USA' },
    { value: 'San Diego, CA, USA', label: 'San Diego, CA, USA' },
    { value: 'Dallas, TX, USA', label: 'Dallas, TX, USA' },
    { value: 'San Jose, CA, USA', label: 'San Jose, CA, USA' },
    { value: 'Austin, TX, USA', label: 'Austin, TX, USA' },
    { value: 'Jacksonville, FL, USA', label: 'Jacksonville, FL, USA' },
    { value: 'Fort Worth, TX, USA', label: 'Fort Worth, TX, USA' },
    { value: 'Columbus, OH, USA', label: 'Columbus, OH, USA' },
    { value: 'Charlotte, NC, USA', label: 'Charlotte, NC, USA' },
    { value: 'San Francisco, CA, USA', label: 'San Francisco, CA, USA' },
    { value: 'Indianapolis, IN, USA', label: 'Indianapolis, IN, USA' },
    { value: 'Seattle, WA, USA', label: 'Seattle, WA, USA' },
    { value: 'Denver, CO, USA', label: 'Denver, CO, USA' },
    { value: 'Boston, MA, USA', label: 'Boston, MA, USA' },
    { value: 'El Paso, TX, USA', label: 'El Paso, TX, USA' },
    { value: 'Nashville, TN, USA', label: 'Nashville, TN, USA' },
    { value: 'Detroit, MI, USA', label: 'Detroit, MI, USA' },
    { value: 'Oklahoma City, OK, USA', label: 'Oklahoma City, OK, USA' },
    { value: 'Portland, OR, USA', label: 'Portland, OR, USA' },
    { value: 'Las Vegas, NV, USA', label: 'Las Vegas, NV, USA' },
    { value: 'Memphis, TN, USA', label: 'Memphis, TN, USA' },
    { value: 'Louisville, KY, USA', label: 'Louisville, KY, USA' },
    { value: 'Baltimore, MD, USA', label: 'Baltimore, MD, USA' },
    { value: 'Milwaukee, WI, USA', label: 'Milwaukee, WI, USA' },
    { value: 'Albuquerque, NM, USA', label: 'Albuquerque, NM, USA' },
    { value: 'Tucson, AZ, USA', label: 'Tucson, AZ, USA' },
    { value: 'Fresno, CA, USA', label: 'Fresno, CA, USA' },
    { value: 'Sacramento, CA, USA', label: 'Sacramento, CA, USA' },
    { value: 'Mesa, AZ, USA', label: 'Mesa, AZ, USA' },
    { value: 'Kansas City, MO, USA', label: 'Kansas City, MO, USA' },
    { value: 'Atlanta, GA, USA', label: 'Atlanta, GA, USA' },
    { value: 'Long Beach, CA, USA', label: 'Long Beach, CA, USA' },
    { value: 'Colorado Springs, CO, USA', label: 'Colorado Springs, CO, USA' },
    { value: 'Miami, FL, USA', label: 'Miami, FL, USA' },
    { value: 'Raleigh, NC, USA', label: 'Raleigh, NC, USA' },
    { value: 'Omaha, NE, USA', label: 'Omaha, NE, USA' },
    { value: 'Virginia Beach, VA, USA', label: 'Virginia Beach, VA, USA' },
    { value: 'Oakland, CA, USA', label: 'Oakland, CA, USA' },
    { value: 'Minneapolis, MN, USA', label: 'Minneapolis, MN, USA' },
    { value: 'Tulsa, OK, USA', label: 'Tulsa, OK, USA' },
    { value: 'Arlington, TX, USA', label: 'Arlington, TX, USA' },
    { value: 'Tampa, FL, USA', label: 'Tampa, FL, USA' },
    { value: 'New Orleans, LA, USA', label: 'New Orleans, LA, USA' },
    { value: 'Wichita, KS, USA', label: 'Wichita, KS, USA' },
    { value: 'Cleveland, OH, USA', label: 'Cleveland, OH, USA' },
    { value: 'Bakersfield, CA, USA', label: 'Bakersfield, CA, USA' },

    // North America - Canada
    { value: 'Toronto, ON, Canada', label: 'Toronto, ON, Canada' },
    { value: 'Montreal, QC, Canada', label: 'Montreal, QC, Canada' },
    { value: 'Vancouver, BC, Canada', label: 'Vancouver, BC, Canada' },
    { value: 'Calgary, AB, Canada', label: 'Calgary, AB, Canada' },
    { value: 'Edmonton, AB, Canada', label: 'Edmonton, AB, Canada' },
    { value: 'Ottawa, ON, Canada', label: 'Ottawa, ON, Canada' },
    { value: 'Winnipeg, MB, Canada', label: 'Winnipeg, MB, Canada' },
    { value: 'Quebec City, QC, Canada', label: 'Quebec City, QC, Canada' },
    { value: 'Hamilton, ON, Canada', label: 'Hamilton, ON, Canada' },
    { value: 'Kitchener, ON, Canada', label: 'Kitchener, ON, Canada' },

    // Europe - UK
    { value: 'London, UK', label: 'London, UK' },
    { value: 'Manchester, UK', label: 'Manchester, UK' },
    { value: 'Birmingham, UK', label: 'Birmingham, UK' },
    { value: 'Liverpool, UK', label: 'Liverpool, UK' },
    { value: 'Leeds, UK', label: 'Leeds, UK' },
    { value: 'Sheffield, UK', label: 'Sheffield, UK' },
    { value: 'Bristol, UK', label: 'Bristol, UK' },
    { value: 'Newcastle, UK', label: 'Newcastle, UK' },
    { value: 'Sunderland, UK', label: 'Sunderland, UK' },
    { value: 'Brighton, UK', label: 'Brighton, UK' },
    { value: 'Nottingham, UK', label: 'Nottingham, UK' },
    { value: 'Leicester, UK', label: 'Leicester, UK' },
    { value: 'Southampton, UK', label: 'Southampton, UK' },
    { value: 'Portsmouth, UK', label: 'Portsmouth, UK' },
    { value: 'Oxford, UK', label: 'Oxford, UK' },
    { value: 'Cambridge, UK', label: 'Cambridge, UK' },

    // Europe - Germany
    { value: 'Berlin, Germany', label: 'Berlin, Germany' },
    { value: 'Munich, Germany', label: 'Munich, Germany' },
    { value: 'Hamburg, Germany', label: 'Hamburg, Germany' },
    { value: 'Cologne, Germany', label: 'Cologne, Germany' },
    { value: 'Frankfurt, Germany', label: 'Frankfurt, Germany' },
    { value: 'Stuttgart, Germany', label: 'Stuttgart, Germany' },
    { value: 'Düsseldorf, Germany', label: 'Düsseldorf, Germany' },
    { value: 'Dortmund, Germany', label: 'Dortmund, Germany' },
    { value: 'Essen, Germany', label: 'Essen, Germany' },
    { value: 'Leipzig, Germany', label: 'Leipzig, Germany' },
    { value: 'Bremen, Germany', label: 'Bremen, Germany' },
    { value: 'Dresden, Germany', label: 'Dresden, Germany' },
    { value: 'Hanover, Germany', label: 'Hanover, Germany' },
    { value: 'Nuremberg, Germany', label: 'Nuremberg, Germany' },
    { value: 'Duisburg, Germany', label: 'Duisburg, Germany' },

    // Europe - France
    { value: 'Paris, France', label: 'Paris, France' },
    { value: 'Marseille, France', label: 'Marseille, France' },
    { value: 'Lyon, France', label: 'Lyon, France' },
    { value: 'Toulouse, France', label: 'Toulouse, France' },
    { value: 'Nice, France', label: 'Nice, France' },
    { value: 'Nantes, France', label: 'Nantes, France' },
    { value: 'Strasbourg, France', label: 'Strasbourg, France' },
    { value: 'Montpellier, France', label: 'Montpellier, France' },
    { value: 'Bordeaux, France', label: 'Bordeaux, France' },
    { value: 'Lille, France', label: 'Lille, France' },

    // Europe - Netherlands
    { value: 'Amsterdam, Netherlands', label: 'Amsterdam, Netherlands' },
    { value: 'Rotterdam, Netherlands', label: 'Rotterdam, Netherlands' },
    { value: 'The Hague, Netherlands', label: 'The Hague, Netherlands' },
    { value: 'Utrecht, Netherlands', label: 'Utrecht, Netherlands' },
    { value: 'Eindhoven, Netherlands', label: 'Eindhoven, Netherlands' },
    { value: 'Tilburg, Netherlands', label: 'Tilburg, Netherlands' },
    { value: 'Groningen, Netherlands', label: 'Groningen, Netherlands' },
    { value: 'Almere, Netherlands', label: 'Almere, Netherlands' },

    // Europe - Sweden
    { value: 'Stockholm, Sweden', label: 'Stockholm, Sweden' },
    { value: 'Gothenburg, Sweden', label: 'Gothenburg, Sweden' },
    { value: 'Malmö, Sweden', label: 'Malmö, Sweden' },
    { value: 'Uppsala, Sweden', label: 'Uppsala, Sweden' },
    { value: 'Västerås, Sweden', label: 'Västerås, Sweden' },
    { value: 'Örebro, Sweden', label: 'Örebro, Sweden' },
    { value: 'Linköping, Sweden', label: 'Linköping, Sweden' },
    { value: 'Helsingborg, Sweden', label: 'Helsingborg, Sweden' },

    // Asia - India
    { value: 'Mumbai, Maharashtra, India', label: 'Mumbai, Maharashtra, India' },
    { value: 'Delhi, India', label: 'Delhi, India' },
    { value: 'Bangalore, Karnataka, India', label: 'Bangalore, Karnataka, India' },
    { value: 'Hyderabad, Telangana, India', label: 'Hyderabad, Telangana, India' },
    { value: 'Chennai, Tamil Nadu, India', label: 'Chennai, Tamil Nadu, India' },
    { value: 'Kolkata, West Bengal, India', label: 'Kolkata, West Bengal, India' },
    { value: 'Pune, Maharashtra, India', label: 'Pune, Maharashtra, India' },
    { value: 'Ahmedabad, Gujarat, India', label: 'Ahmedabad, Gujarat, India' },
    { value: 'Jaipur, Rajasthan, India', label: 'Jaipur, Rajasthan, India' },
    { value: 'Surat, Gujarat, India', label: 'Surat, Gujarat, India' },
    { value: 'Lucknow, Uttar Pradesh, India', label: 'Lucknow, Uttar Pradesh, India' },
    { value: 'Kanpur, Uttar Pradesh, India', label: 'Kanpur, Uttar Pradesh, India' },
    { value: 'Nagpur, Maharashtra, India', label: 'Nagpur, Maharashtra, India' },
    { value: 'Patna, Bihar, India', label: 'Patna, Bihar, India' },
    { value: 'Indore, Madhya Pradesh, India', label: 'Indore, Madhya Pradesh, India' },
    { value: 'Vadodara, Gujarat, India', label: 'Vadodara, Gujarat, India' },
    { value: 'Ghaziabad, Uttar Pradesh, India', label: 'Ghaziabad, Uttar Pradesh, India' },
    { value: 'Ludhiana, Punjab, India', label: 'Ludhiana, Punjab, India' },
    { value: 'Agra, Uttar Pradesh, India', label: 'Agra, Uttar Pradesh, India' },
    { value: 'Nashik, Maharashtra, India', label: 'Nashik, Maharashtra, India' },
    { value: 'Faridabad, Haryana, India', label: 'Faridabad, Haryana, India' },
    { value: 'Meerut, Uttar Pradesh, India', label: 'Meerut, Uttar Pradesh, India' },
    { value: 'Rajkot, Gujarat, India', label: 'Rajkot, Gujarat, India' },
    { value: 'Kalyan-Dombivli, Maharashtra, India', label: 'Kalyan-Dombivli, Maharashtra, India' },
    { value: 'Vasai-Virar, Maharashtra, India', label: 'Vasai-Virar, Maharashtra, India' },
    { value: 'Varanasi, Uttar Pradesh, India', label: 'Varanasi, Uttar Pradesh, India' },
    { value: 'Srinagar, Jammu and Kashmir, India', label: 'Srinagar, Jammu and Kashmir, India' },
    { value: 'Aurangabad, Maharashtra, India', label: 'Aurangabad, Maharashtra, India' },
    { value: 'Dhanbad, Jharkhand, India', label: 'Dhanbad, Jharkhand, India' },
    { value: 'Amritsar, Punjab, India', label: 'Amritsar, Punjab, India' },
    { value: 'Navi Mumbai, Maharashtra, India', label: 'Navi Mumbai, Maharashtra, India' },
    { value: 'Allahabad, Uttar Pradesh, India', label: 'Allahabad, Uttar Pradesh, India' },
    { value: 'Ranchi, Jharkhand, India', label: 'Ranchi, Jharkhand, India' },
    { value: 'Howrah, West Bengal, India', label: 'Howrah, West Bengal, India' },
    { value: 'Coimbatore, Tamil Nadu, India', label: 'Coimbatore, Tamil Nadu, India' },
    { value: 'Jabalpur, Madhya Pradesh, India', label: 'Jabalpur, Madhya Pradesh, India' },
    { value: 'Gwalior, Madhya Pradesh, India', label: 'Gwalior, Madhya Pradesh, India' },
    { value: 'Vijayawada, Andhra Pradesh, India', label: 'Vijayawada, Andhra Pradesh, India' },
    { value: 'Jodhpur, Rajasthan, India', label: 'Jodhpur, Rajasthan, India' },
    { value: 'Madurai, Tamil Nadu, India', label: 'Madurai, Tamil Nadu, India' },
    { value: 'Raipur, Chhattisgarh, India', label: 'Raipur, Chhattisgarh, India' },
    { value: 'Kota, Rajasthan, India', label: 'Kota, Rajasthan, India' },
    { value: 'Guwahati, Assam, India', label: 'Guwahati, Assam, India' },
    { value: 'Chandigarh, India', label: 'Chandigarh, India' },
    { value: 'Solapur, Maharashtra, India', label: 'Solapur, Maharashtra, India' },
    { value: 'Hubli-Dharwad, Karnataka, India', label: 'Hubli-Dharwad, Karnataka, India' },
    { value: 'Bareilly, Uttar Pradesh, India', label: 'Bareilly, Uttar Pradesh, India' },
    { value: 'Moradabad, Uttar Pradesh, India', label: 'Moradabad, Uttar Pradesh, India' },
    { value: 'Mysore, Karnataka, India', label: 'Mysore, Karnataka, India' },
    { value: 'Gurgaon, Haryana, India', label: 'Gurgaon, Haryana, India' },
    { value: 'Aligarh, Uttar Pradesh, India', label: 'Aligarh, Uttar Pradesh, India' },
    { value: 'Jalandhar, Punjab, India', label: 'Jalandhar, Punjab, India' },
    { value: 'Tiruchirappalli, Tamil Nadu, India', label: 'Tiruchirappalli, Tamil Nadu, India' },
    { value: 'Bhubaneswar, Odisha, India', label: 'Bhubaneswar, Odisha, India' },
    { value: 'Salem, Tamil Nadu, India', label: 'Salem, Tamil Nadu, India' },
    { value: 'Warangal, Telangana, India', label: 'Warangal, Telangana, India' },
    { value: 'Guntur, Andhra Pradesh, India', label: 'Guntur, Andhra Pradesh, India' },
    { value: 'Bhiwandi, Maharashtra, India', label: 'Bhiwandi, Maharashtra, India' },
    { value: 'Saharanpur, Uttar Pradesh, India', label: 'Saharanpur, Uttar Pradesh, India' },
    { value: 'Gorakhpur, Uttar Pradesh, India', label: 'Gorakhpur, Uttar Pradesh, India' },
    { value: 'Bikaner, Rajasthan, India', label: 'Bikaner, Rajasthan, India' },
    { value: 'Amravati, Maharashtra, India', label: 'Amravati, Maharashtra, India' },
    { value: 'Noida, Uttar Pradesh, India', label: 'Noida, Uttar Pradesh, India' },
    { value: 'Jamshedpur, Jharkhand, India', label: 'Jamshedpur, Jharkhand, India' },
    { value: 'Bhilai, Chhattisgarh, India', label: 'Bhilai, Chhattisgarh, India' },
    { value: 'Cuttack, Odisha, India', label: 'Cuttack, Odisha, India' },
    { value: 'Firozabad, Uttar Pradesh, India', label: 'Firozabad, Uttar Pradesh, India' },
    { value: 'Kochi, Kerala, India', label: 'Kochi, Kerala, India' },
    { value: 'Nellore, Andhra Pradesh, India', label: 'Nellore, Andhra Pradesh, India' },
    { value: 'Bhavnagar, Gujarat, India', label: 'Bhavnagar, Gujarat, India' },
    { value: 'Dehradun, Uttarakhand, India', label: 'Dehradun, Uttarakhand, India' },
    { value: 'Durgapur, West Bengal, India', label: 'Durgapur, West Bengal, India' },
    { value: 'Asansol, West Bengal, India', label: 'Asansol, West Bengal, India' },
    { value: 'Rourkela, Odisha, India', label: 'Rourkela, Odisha, India' },
    { value: 'Nanded, Maharashtra, India', label: 'Nanded, Maharashtra, India' },
    { value: 'Kolhapur, Maharashtra, India', label: 'Kolhapur, Maharashtra, India' },
    { value: 'Ajmer, Rajasthan, India', label: 'Ajmer, Rajasthan, India' },
    { value: 'Akola, Maharashtra, India', label: 'Akola, Maharashtra, India' },
    { value: 'Gulbarga, Karnataka, India', label: 'Gulbarga, Karnataka, India' },
    { value: 'Jamnagar, Gujarat, India', label: 'Jamnagar, Gujarat, India' },
    { value: 'Ujjain, Madhya Pradesh, India', label: 'Ujjain, Madhya Pradesh, India' },
    { value: 'Loni, Uttar Pradesh, India', label: 'Loni, Uttar Pradesh, India' },
    { value: 'Siliguri, West Bengal, India', label: 'Siliguri, West Bengal, India' },
    { value: 'Jhansi, Uttar Pradesh, India', label: 'Jhansi, Uttar Pradesh, India' },
    { value: 'Ulhasnagar, Maharashtra, India', label: 'Ulhasnagar, Maharashtra, India' },
    { value: 'Jammu, Jammu and Kashmir, India', label: 'Jammu, Jammu and Kashmir, India' },
    { value: 'Sangli-Miraj & Kupwad, Maharashtra, India', label: 'Sangli-Miraj & Kupwad, Maharashtra, India' },
    { value: 'Mangalore, Karnataka, India', label: 'Mangalore, Karnataka, India' },
    { value: 'Erode, Tamil Nadu, India', label: 'Erode, Tamil Nadu, India' },
    { value: 'Belgaum, Karnataka, India', label: 'Belgaum, Karnataka, India' },
    { value: 'Ambattur, Tamil Nadu, India', label: 'Ambattur, Tamil Nadu, India' },
    { value: 'Tirunelveli, Tamil Nadu, India', label: 'Tirunelveli, Tamil Nadu, India' },
    { value: 'Malegaon, Maharashtra, India', label: 'Malegaon, Maharashtra, India' },
    { value: 'Gaya, Bihar, India', label: 'Gaya, Bihar, India' },
    { value: 'Tiruppur, Tamil Nadu, India', label: 'Tiruppur, Tamil Nadu, India' },
    { value: 'Davanagere, Karnataka, India', label: 'Davanagere, Karnataka, India' },
    { value: 'Kozhikode, Kerala, India', label: 'Kozhikode, Kerala, India' },
    { value: 'Akola, Maharashtra, India', label: 'Akola, Maharashtra, India' },
    { value: 'Kurnool, Andhra Pradesh, India', label: 'Kurnool, Andhra Pradesh, India' },
    { value: 'Bokaro Steel City, Jharkhand, India', label: 'Bokaro Steel City, Jharkhand, India' },
    { value: 'Rajahmundry, Andhra Pradesh, India', label: 'Rajahmundry, Andhra Pradesh, India' },
    { value: 'Ballari, Karnataka, India', label: 'Ballari, Karnataka, India' },
    { value: 'Agartala, Tripura, India', label: 'Agartala, Tripura, India' },
    { value: 'Bhagalpur, Bihar, India', label: 'Bhagalpur, Bihar, India' },
    { value: 'Latur, Maharashtra, India', label: 'Latur, Maharashtra, India' },
    { value: 'Dhule, Maharashtra, India', label: 'Dhule, Maharashtra, India' },
    { value: 'Korba, Chhattisgarh, India', label: 'Korba, Chhattisgarh, India' },
    { value: 'Bhilwara, Rajasthan, India', label: 'Bhilwara, Rajasthan, India' },
    { value: 'Brahmapur, Odisha, India', label: 'Brahmapur, Odisha, India' },
    { value: 'Mysore, Karnataka, India', label: 'Mysore, Karnataka, India' },
    { value: 'Muzaffarpur, Bihar, India', label: 'Muzaffarpur, Bihar, India' },
    { value: 'Ahmednagar, Maharashtra, India', label: 'Ahmednagar, Maharashtra, India' },
    { value: 'Kollam, Kerala, India', label: 'Kollam, Kerala, India' },
    { value: 'Raghunathganj, West Bengal, India', label: 'Raghunathganj, West Bengal, India' },
    { value: 'Bilaspur, Chhattisgarh, India', label: 'Bilaspur, Chhattisgarh, India' },
    { value: 'Shahjahanpur, Uttar Pradesh, India', label: 'Shahjahanpur, Uttar Pradesh, India' },
    { value: 'Thrissur, Kerala, India', label: 'Thrissur, Kerala, India' },
    { value: 'Alwar, Rajasthan, India', label: 'Alwar, Rajasthan, India' },
    { value: 'Kakinada, Andhra Pradesh, India', label: 'Kakinada, Andhra Pradesh, India' },
    { value: 'Nizamabad, Telangana, India', label: 'Nizamabad, Telangana, India' },
    { value: 'Parbhani, Maharashtra, India', label: 'Parbhani, Maharashtra, India' },
    { value: 'Tumkur, Karnataka, India', label: 'Tumkur, Karnataka, India' },
    { value: 'Khammam, Telangana, India', label: 'Khammam, Telangana, India' },
    { value: 'Ozhukarai, Puducherry, India', label: 'Ozhukarai, Puducherry, India' },
    { value: 'Bihar Sharif, Bihar, India', label: 'Bihar Sharif, Bihar, India' },
    { value: 'Panipat, Haryana, India', label: 'Panipat, Haryana, India' },
    { value: 'Darbhanga, Bihar, India', label: 'Darbhanga, Bihar, India' },
    { value: 'Bally, West Bengal, India', label: 'Bally, West Bengal, India' },
    { value: 'Aizawl, Mizoram, India', label: 'Aizawl, Mizoram, India' },
    { value: 'Dewas, Madhya Pradesh, India', label: 'Dewas, Madhya Pradesh, India' },
    { value: 'Ichalkaranji, Maharashtra, India', label: 'Ichalkaranji, Maharashtra, India' },
    { value: 'Karnal, Haryana, India', label: 'Karnal, Haryana, India' },
    { value: 'Bathinda, Punjab, India', label: 'Bathinda, Punjab, India' },
    { value: 'Jalna, Maharashtra, India', label: 'Jalna, Maharashtra, India' },
    { value: 'Eluru, Andhra Pradesh, India', label: 'Eluru, Andhra Pradesh, India' },
    { value: 'Kirari Suleman Nagar, Delhi, India', label: 'Kirari Suleman Nagar, Delhi, India' },
    { value: 'Barasat, West Bengal, India', label: 'Barasat, West Bengal, India' },
    { value: 'Purnia, Bihar, India', label: 'Purnia, Bihar, India' },
    { value: 'Satna, Madhya Pradesh, India', label: 'Satna, Madhya Pradesh, India' },
    { value: 'Mau, Uttar Pradesh, India', label: 'Mau, Uttar Pradesh, India' },
    { value: 'Sonipat, Haryana, India', label: 'Sonipat, Haryana, India' },
    { value: 'Farrukhabad, Uttar Pradesh, India', label: 'Farrukhabad, Uttar Pradesh, India' },
    { value: 'Sagar, Madhya Pradesh, India', label: 'Sagar, Madhya Pradesh, India' },
    { value: 'Rourkela, Odisha, India', label: 'Rourkela, Odisha, India' },
    { value: 'Durg, Chhattisgarh, India', label: 'Durg, Chhattisgarh, India' },
    { value: 'Imphal, Manipur, India', label: 'Imphal, Manipur, India' },
    { value: 'Ratlam, Madhya Pradesh, India', label: 'Ratlam, Madhya Pradesh, India' },
    { value: 'Hapur, Uttar Pradesh, India', label: 'Hapur, Uttar Pradesh, India' },
    { value: 'Arrah, Bihar, India', label: 'Arrah, Bihar, India' },
    { value: 'Karimnagar, Telangana, India', label: 'Karimnagar, Telangana, India' },
    { value: 'Anantapur, Andhra Pradesh, India', label: 'Anantapur, Andhra Pradesh, India' },
    { value: 'Etawah, Uttar Pradesh, India', label: 'Etawah, Uttar Pradesh, India' },
    { value: 'Ambernath, Maharashtra, India', label: 'Ambernath, Maharashtra, India' },
    { value: 'North Dumdum, West Bengal, India', label: 'North Dumdum, West Bengal, India' },
    { value: 'Bharatpur, Rajasthan, India', label: 'Bharatpur, Rajasthan, India' },
    { value: 'Begusarai, Bihar, India', label: 'Begusarai, Bihar, India' },
    { value: 'New Delhi, India', label: 'New Delhi, India' },
    { value: 'Gandhidham, Gujarat, India', label: 'Gandhidham, Gujarat, India' },
    { value: 'Baranagar, West Bengal, India', label: 'Baranagar, West Bengal, India' },
    { value: 'Tiruvottiyur, Tamil Nadu, India', label: 'Tiruvottiyur, Tamil Nadu, India' },
    { value: 'Puducherry, India', label: 'Puducherry, India' },
    { value: 'Sikar, Rajasthan, India', label: 'Sikar, Rajasthan, India' },
    { value: 'Thoothukudi, Tamil Nadu, India', label: 'Thoothukudi, Tamil Nadu, India' },
    { value: 'Rewa, Madhya Pradesh, India', label: 'Rewa, Madhya Pradesh, India' },
    { value: 'Mirzapur, Uttar Pradesh, India', label: 'Mirzapur, Uttar Pradesh, India' },
    { value: 'Raichur, Karnataka, India', label: 'Raichur, Karnataka, India' },
    { value: 'Pali, Rajasthan, India', label: 'Pali, Rajasthan, India' },
    { value: 'Ramagundam, Telangana, India', label: 'Ramagundam, Telangana, India' },
    { value: 'Haridwar, Uttarakhand, India', label: 'Haridwar, Uttarakhand, India' },
    { value: 'Vijayanagaram, Andhra Pradesh, India', label: 'Vijayanagaram, Andhra Pradesh, India' },
    { value: 'Katihar, Bihar, India', label: 'Katihar, Bihar, India' },
    { value: 'Nagaur, Rajasthan, India', label: 'Nagaur, Rajasthan, India' },
    { value: 'Sri Ganganagar, Rajasthan, India', label: 'Sri Ganganagar, Rajasthan, India' },
    { value: 'Karawal Nagar, Delhi, India', label: 'Karawal Nagar, Delhi, India' },
    { value: 'Baraut, Uttar Pradesh, India', label: 'Baraut, Uttar Pradesh, India' },
    { value: 'Port Blair, Andaman and Nicobar Islands, India', label: 'Port Blair, Andaman and Nicobar Islands, India' },
    { value: 'Machilipatnam, Andhra Pradesh, India', label: 'Machilipatnam, Andhra Pradesh, India' },
    { value: 'Ongole, Andhra Pradesh, India', label: 'Ongole, Andhra Pradesh, India' },
    { value: 'Kottayam, Kerala, India', label: 'Kottayam, Kerala, India' },
    { value: 'Dhanbad, Jharkhand, India', label: 'Dhanbad, Jharkhand, India' },
    { value: 'Nadiad, Gujarat, India', label: 'Nadiad, Gujarat, India' },
    { value: 'Sambalpur, Odisha, India', label: 'Sambalpur, Odisha, India' },
    { value: 'Budaun, Uttar Pradesh, India', label: 'Budaun, Uttar Pradesh, India' },
    { value: 'Buxar, Bihar, India', label: 'Buxar, Bihar, India' },
    { value: 'Shivpuri, Madhya Pradesh, India', label: 'Shivpuri, Madhya Pradesh, India' },
    { value: 'Valsad, Gujarat, India', label: 'Valsad, Gujarat, India' },
    { value: 'Panihati, West Bengal, India', label: 'Panihati, West Bengal, India' },
    { value: 'Kavali, Andhra Pradesh, India', label: 'Kavali, Andhra Pradesh, India' },
    { value: 'Cuddalore, Tamil Nadu, India', label: 'Cuddalore, Tamil Nadu, India' },
    { value: 'Kanhangad, Kerala, India', label: 'Kanhangad, Kerala, India' },
    { value: 'Vapi, Gujarat, India', label: 'Vapi, Gujarat, India' },
    { value: 'Tinsukia, Assam, India', label: 'Tinsukia, Assam, India' },
    { value: 'Itanagar, Arunachal Pradesh, India', label: 'Itanagar, Arunachal Pradesh, India' },
    { value: 'Tezpur, Assam, India', label: 'Tezpur, Assam, India' },
    { value: 'Dibrugarh, Assam, India', label: 'Dibrugarh, Assam, India' },
    { value: 'Jorhat, Assam, India', label: 'Jorhat, Assam, India' },
    { value: 'Nagaon, Assam, India', label: 'Nagaon, Assam, India' },
    { value: 'Tamluk, West Bengal, India', label: 'Tamluk, West Bengal, India' },
    { value: 'Adoni, Andhra Pradesh, India', label: 'Adoni, Andhra Pradesh, India' },
    { value: 'Honavar, Karnataka, India', label: 'Honavar, Karnataka, India' },
    { value: 'Kanchipuram, Tamil Nadu, India', label: 'Kanchipuram, Tamil Nadu, India' },
    { value: 'Tenali, Andhra Pradesh, India', label: 'Tenali, Andhra Pradesh, India' },
    { value: 'Proddatur, Andhra Pradesh, India', label: 'Proddatur, Andhra Pradesh, India' },
    { value: 'Sasaram, Bihar, India', label: 'Sasaram, Bihar, India' },
    { value: 'Hajipur, Bihar, India', label: 'Hajipur, Bihar, India' },
    { value: 'Nawada, Bihar, India', label: 'Nawada, Bihar, India' },
    { value: 'Sitamarhi, Bihar, India', label: 'Sitamarhi, Bihar, India' },
    { value: 'Chhapra, Bihar, India', label: 'Chhapra, Bihar, India' },
    { value: 'Siwan, Bihar, India', label: 'Siwan, Bihar, India' },
    { value: 'Motihari, Bihar, India', label: 'Motihari, Bihar, India' },
    { value: 'Gopalganj, Bihar, India', label: 'Gopalganj, Bihar, India' },
    { value: 'Bettiah, Bihar, India', label: 'Bettiah, Bihar, India' },
    { value: 'Dehri, Bihar, India', label: 'Dehri, Bihar, India' },
    { value: 'Sasaram, Bihar, India', label: 'Sasaram, Bihar, India' },
    { value: 'Hajipur, Bihar, India', label: 'Hajipur, Bihar, India' },
    { value: 'Nawada, Bihar, India', label: 'Nawada, Bihar, India' },
    { value: 'Sitamarhi, Bihar, India', label: 'Sitamarhi, Bihar, India' },
    { value: 'Chhapra, Bihar, India', label: 'Chhapra, Bihar, India' },
    { value: 'Siwan, Bihar, India', label: 'Siwan, Bihar, India' },
    { value: 'Motihari, Bihar, India', label: 'Motihari, Bihar, India' },
    { value: 'Gopalganj, Bihar, India', label: 'Gopalganj, Bihar, India' },
    { value: 'Bettiah, Bihar, India', label: 'Bettiah, Bihar, India' },
    { value: 'Dehri, Bihar, India', label: 'Dehri, Bihar, India' },

    // Asia - Japan
    { value: 'Tokyo, Japan', label: 'Tokyo, Japan' },
    { value: 'Yokohama, Japan', label: 'Yokohama, Japan' },
    { value: 'Osaka, Japan', label: 'Osaka, Japan' },
    { value: 'Nagoya, Japan', label: 'Nagoya, Japan' },
    { value: 'Sapporo, Japan', label: 'Sapporo, Japan' },
    { value: 'Fukuoka, Japan', label: 'Fukuoka, Japan' },
    { value: 'Kobe, Japan', label: 'Kobe, Japan' },
    { value: 'Kawasaki, Japan', label: 'Kawasaki, Japan' },
    { value: 'Saitama, Japan', label: 'Saitama, Japan' },
    { value: 'Hiroshima, Japan', label: 'Hiroshima, Japan' },

    // Asia - South Korea
    { value: 'Seoul, South Korea', label: 'Seoul, South Korea' },
    { value: 'Busan, South Korea', label: 'Busan, South Korea' },
    { value: 'Incheon, South Korea', label: 'Incheon, South Korea' },
    { value: 'Daegu, South Korea', label: 'Daegu, South Korea' },
    { value: 'Daejeon, South Korea', label: 'Daejeon, South Korea' },
    { value: 'Gwangju, South Korea', label: 'Gwangju, South Korea' },
    { value: 'Suwon, South Korea', label: 'Suwon, South Korea' },
    { value: 'Ulsan, South Korea', label: 'Ulsan, South Korea' },

    // Asia - China
    { value: 'Shanghai, China', label: 'Shanghai, China' },
    { value: 'Beijing, China', label: 'Beijing, China' },
    { value: 'Shenzhen, China', label: 'Shenzhen, China' },
    { value: 'Guangzhou, China', label: 'Guangzhou, China' },
    { value: 'Chengdu, China', label: 'Chengdu, China' },
    { value: 'Hangzhou, China', label: 'Hangzhou, China' },
    { value: 'Wuhan, China', label: 'Wuhan, China' },
    { value: 'Xi\'an, China', label: 'Xi\'an, China' },
    { value: 'Suzhou, China', label: 'Suzhou, China' },
    { value: 'Tianjin, China', label: 'Tianjin, China' },

    // Asia - Singapore
    { value: 'Singapore', label: 'Singapore' },

    // Middle East - UAE
    { value: 'Dubai, UAE', label: 'Dubai, UAE' },
    { value: 'Abu Dhabi, UAE', label: 'Abu Dhabi, UAE' },
    { value: 'Sharjah, UAE', label: 'Sharjah, UAE' },
    { value: 'Ajman, UAE', label: 'Ajman, UAE' },
    { value: 'Ras Al Khaimah, UAE', label: 'Ras Al Khaimah, UAE' },

    // Australia
    { value: 'Sydney, NSW, Australia', label: 'Sydney, NSW, Australia' },
    { value: 'Melbourne, VIC, Australia', label: 'Melbourne, VIC, Australia' },
    { value: 'Brisbane, QLD, Australia', label: 'Brisbane, QLD, Australia' },
    { value: 'Perth, WA, Australia', label: 'Perth, WA, Australia' },
    { value: 'Adelaide, SA, Australia', label: 'Adelaide, SA, Australia' },
    { value: 'Gold Coast, QLD, Australia', label: 'Gold Coast, QLD, Australia' },
    { value: 'Canberra, ACT, Australia', label: 'Canberra, ACT, Australia' },
    { value: 'Newcastle, NSW, Australia', label: 'Newcastle, NSW, Australia' },
    { value: 'Central Coast, NSW, Australia', label: 'Central Coast, NSW, Australia' },

    // Remote Work
    { value: 'Remote', label: 'Remote' }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        name: userData.name || '',
        title: userData.title || '',
        location: userData.location || '',
        bio: userData.bio || '',
        twitter: userData.twitter || '',
        linkedin: userData.linkedin || '',
        dribbble: userData.dribbble || '',
        leetcode: userData.leetcode || '',
        codeforces: userData.codeforces || '',
        currentCompany: userData.currentCompany || '',
        currentPosition: userData.currentPosition || '',
        experience: userData.experience || '',
        workHistory: userData.workHistory || [],
        skills: userData.skills || [],
        certificates: userData.certificates || []
      });

      setProfileData({
        experience: userData.experience || '',
        currentCompany: {
          name: userData.currentCompany || '',
          logo: userData.currentCompany ? userData.currentCompany.charAt(0) : '',
          logoColor: "bg-blue-500"
        },
        skills: userData.skills || [],
        workHistory: userData.workHistory || [],
        certificates: userData.certificates || []
      });
    }

    // Load profile image from localStorage
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  // D3.js Charts Effect
  useEffect(() => {
    if (formData.skills.length > 0 && skillsChartRef.current) {
      createSkillsChart();
    }
    if (formData.experience && experienceChartRef.current) {
      createExperienceChart();
    }
  }, [formData.skills, formData.experience]);

  const createSkillsChart = () => {
    if (!skillsChartRef.current) return;

    // Clear previous chart
    d3.select(skillsChartRef.current).selectAll("*").remove();

    const data = formData.skills.map((skill, index) => ({
      skill: skill,
      value: Math.random() * 100 + 20, // Mock proficiency data
      color: d3.schemeCategory10[index % 10]
    }));

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 300 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select(skillsChartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.skill))
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, d => d.value)]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g")
      .call(d3.axisLeft(y));

    svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.skill))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", d => d.color);
  };

  const createExperienceChart = () => {
    if (!experienceChartRef.current) return;

    // Clear previous chart
    d3.select(experienceChartRef.current).selectAll("*").remove();

    const experienceYears = parseInt(formData.experience) || 0;
    const data = [
      { label: 'Experience', value: experienceYears, color: '#3b82f6' },
      { label: 'Remaining', value: 10 - experienceYears, color: '#e5e7eb' }
    ];

    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(experienceChartRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie()
      .value(d => d.value);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    svg.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => d.data.color);

    // Add text in center
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text(`${experienceYears} yrs`);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Show immediate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setProfileImage(imageUrl);
      };
      reader.readAsDataURL(file);

      // Upload to backend
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('http://localhost:5001/api/upload/image', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const cloudinaryUrl = data.imageUrl;

          // Save to database
          const profileResponse = await fetch('http://localhost:5001/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              profileImage: cloudinaryUrl
            }),
          });

          if (profileResponse.ok) {
            // Update local state
            const updatedUser = { ...user, profileImage: cloudinaryUrl };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            localStorage.setItem('profileImage', cloudinaryUrl);
            console.log('Profile image saved to database successfully');
          }
        } else {
          console.error('Failed to upload image to Cloudinary');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        // Fallback: still save locally
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target.result;
          localStorage.setItem('profileImage', imageUrl);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSave = async () => {
    try {
      // Save to backend
      const response = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...formData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state and localStorage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        console.log('Profile saved to database successfully');
      } else {
        console.error('Failed to save profile to database');
        // Still save locally as fallback
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      // Fallback to localStorage only
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/auth/account/${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Clear local storage and redirect to home
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('profileImage');
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        alert(`Failed to delete account: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      title: user?.title || '',
      location: user?.location || '',
      bio: user?.bio || '',
      twitter: user?.twitter || '',
      linkedin: user?.linkedin || '',
      dribbble: user?.dribbble || '',
      leetcode: user?.leetcode || '',
      codeforces: user?.codeforces || '',
      currentCompany: user?.currentCompany || '',
      currentPosition: user?.currentPosition || '',
      experience: user?.experience || '',
      workHistory: user?.workHistory || [],
      skills: user?.skills || [],
      certificates: user?.certificates || []
    });

    setProfileData({
      experience: user?.experience || '',
      currentCompany: {
        name: user?.currentCompany || '',
        logo: user?.currentCompany ? user.currentCompany.charAt(0) : '',
        logoColor: "bg-blue-500"
      },
      skills: user?.skills || [],
      workHistory: user?.workHistory || [],
      certificates: user?.certificates || []
    });
    setIsEditing(false);
  };

  const [profileData, setProfileData] = useState({
    experience: "",
    currentCompany: {
      name: "",
      logo: "",
      logoColor: "bg-blue-500"
    },
    skills: [],
    workHistory: [],
    certificates: []
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">GrabIt</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors pb-2 border-b-2 border-transparent hover:border-blue-600">
                Home
              </Link>
              <Link to="/jobs" className="text-gray-700 hover:text-blue-600 transition-colors pb-2 border-b-2 border-transparent hover:border-blue-600">
                Find Jobs
              </Link>
              <Link to="/interests" className="text-gray-700 hover:text-blue-600 transition-colors pb-2 border-b-2 border-transparent hover:border-blue-600">
                My Interests
              </Link>
              <Link to="/discussions" className="text-gray-700 hover:text-blue-600 transition-colors pb-2 border-b-2 border-transparent hover:border-blue-600">
                Discussion
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors pb-2 border-b-2 border-transparent hover:border-blue-600">
                Contact
              </Link>
            </nav>

            {/* Profile Section */}
            <div className="flex items-center gap-4">
              <ProfileDropdown user={user} onLogout={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('profileImage');
                window.location.href = '/';
              }} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-10 mx-6 lg:mx-8"></div>

        {/* Profile Avatar positioned over the banner */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              (() => {
                const getAvatarStyle = (gender) => {
                  switch (gender?.toLowerCase()) {
                    case 'male':
                      return avataaars;
                    case 'female':
                      return lorelei;
                    default:
                      return lorelei;
                  }
                };

                const avatarStyle = getAvatarStyle(user?.gender);
                const avatar = createAvatar(avatarStyle, {
                  seed: user?.name || 'default',
                  size: 128,
                });
                const avatarDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`;
                return (
                  <img
                    src={avatarDataUri}
                    alt={`${user?.name || "User"} avatar`}
                    className="w-full h-full rounded-full shadow-lg"
                  />
                );
              })()
            )}

            {/* Upload Overlay */}
            <div
              className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Verification Badge */}
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl lg:text-6xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight"
              >
                My Profile
                <span className="ml-2">🚀</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
              >
                Manage your professional profile and showcase your skills to potential employers.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      <div className="pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-xl border border-white/20 relative overflow-hidden"
          >

            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Profile Picture */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    (() => {
                      const getAvatarStyle = (gender) => {
                        switch (gender?.toLowerCase()) {
                          case 'male':
                            return avataaars;
                          case 'female':
                            return lorelei;
                          default:
                            return lorelei;
                        }
                      };

                      const avatarStyle = getAvatarStyle(user?.gender);
                      const avatar = createAvatar(avatarStyle, {
                        seed: user?.name || 'default',
                        size: 128,
                      });
                      const avatarDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`;
                      return (
                        <img
                          src={avatarDataUri}
                          alt={`${user?.name || "User"} avatar`}
                          className="w-full h-full rounded-full shadow-lg"
                        />
                      );
                    })()
                  )}

                  {/* Upload Overlay */}
                  <div
                    className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Verification Badge */}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="text-4xl font-bold border-0 p-0 h-auto bg-transparent focus:ring-0"
                      placeholder="Your name"
                    />
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="text-xl text-purple-600 font-medium border-0 p-0 h-auto bg-transparent focus:ring-0"
                      placeholder="Your title"
                    />
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <SelectLib
                        value={worldCities.find(city => city.value === formData.location)}
                        onChange={(selectedOption) => setFormData({...formData, location: selectedOption ? selectedOption.value : ''})}
                        options={worldCities}
                        placeholder="Search and select your location..."
                        isClearable
                        isSearchable
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: base => ({ ...base, zIndex: 9999 }),
                          menu: (provided) => ({
                            ...provided,
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            maxHeight: '300px',
                            overflowY: 'auto'
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'white',
                            color: state.isSelected ? 'white' : '#374151',
                            padding: '12px 16px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }),
                          control: (provided, state) => ({
                            ...provided,
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            backgroundColor: 'transparent',
                            minHeight: 'auto',
                            boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                            '&:hover': {
                              borderColor: '#9ca3af'
                            }
                          }),
                          placeholder: (provided) => ({
                            ...provided,
                            color: '#6b7280',
                            fontSize: '14px'
                          }),
                          singleValue: (provided) => ({
                            ...provided,
                            color: '#374151',
                            fontSize: '14px'
                          }),
                          input: (provided) => ({
                            ...provided,
                            color: '#374151',
                            fontSize: '14px'
                          })
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{formData.name || 'Your Name'}</h1>
                    <p className="text-xl text-purple-600 font-medium mb-3">{formData.title || 'Your Professional Title'}</p>

                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="w-5 h-5" />
                      <span>{formData.location || 'Your Location'}</span>
                    </div>

                    {/* My Posts Button */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => navigate('/discussions')}
                        className="bg-[#FF6B55] hover:bg-[#FF5542] text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        My Posts
                      </Button>
                    </div>
                  </>
                )}

                {/* Social Links */}
                <div className="flex items-center gap-4 mt-4">
                  {formData.twitter && (
                    <motion.a
                      href={formData.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors"
                      title="Twitter Profile"
                    >
                      <Twitter className="w-5 h-5 text-gray-600 hover:text-blue-500" />
                    </motion.a>
                  )}
                  {formData.linkedin && (
                    <motion.a
                      href={formData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-5 h-5 text-gray-600 hover:text-blue-600" />
                    </motion.a>
                  )}
                  {formData.dribbble && (
                    <motion.a
                      href={formData.dribbble}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 bg-gray-100 hover:bg-pink-100 rounded-full flex items-center justify-center transition-colors"
                      title="Dribbble Profile"
                    >
                      <Dribbble className="w-5 h-5 text-gray-600 hover:text-pink-500" />
                    </motion.a>
                  )}
                  {formData.leetcode && (
                    <motion.a
                      href={formData.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 bg-gray-100 hover:bg-orange-100 rounded-full flex items-center justify-center transition-colors"
                      title="LeetCode Profile"
                    >
                      <Code className="w-5 h-5 text-gray-600 hover:text-orange-500" />
                    </motion.a>
                  )}
                  {formData.codeforces && (
                    <motion.a
                      href={formData.codeforces}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors"
                      title="Codeforces Profile"
                    >
                      <Trophy className="w-5 h-5 text-gray-600 hover:text-red-500" />
                    </motion.a>
                  )}
                </div>

                {/* Edit Mode Social Links */}
                {isEditing && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Social Links</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Twitter className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <Input
                          value={formData.twitter}
                          onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                          placeholder="Twitter profile URL (e.g., https://twitter.com/username)"
                          className="flex-1 text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Linkedin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <Input
                          value={formData.linkedin}
                          onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                          placeholder="LinkedIn profile URL (e.g., https://linkedin.com/in/username)"
                          className="flex-1 text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Dribbble className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <Input
                          value={formData.dribbble}
                          onChange={(e) => setFormData({...formData, dribbble: e.target.value})}
                          placeholder="Dribbble profile URL (e.g., https://dribbble.com/username)"
                          className="flex-1 text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Code className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <Input
                          value={formData.leetcode}
                          onChange={(e) => setFormData({...formData, leetcode: e.target.value})}
                          placeholder="LeetCode profile URL (e.g., https://leetcode.com/username)"
                          className="flex-1 text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <Input
                          value={formData.codeforces}
                          onChange={(e) => setFormData({...formData, codeforces: e.target.value})}
                          placeholder="Codeforces profile URL (e.g., https://codeforces.com/profile/username)"
                          className="flex-1 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Edit/Save/Cancel Buttons */}
              {isEditing ? (
                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="px-6 py-3 rounded-full border-gray-300 hover:bg-gray-50 transition-all duration-300"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </motion.div>

          {/* Feature Cards Section */}
          <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0 * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-8 bg-white/80 backdrop-blur-sm border-4 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-2xl text-gray-900 font-semibold">Complete Your Profile</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Add your professional details, skills, and experience to stand out to employers.
                    </p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-8 bg-white/80 backdrop-blur-sm border-4 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-2xl text-gray-900 font-semibold">Showcase Your Work</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Highlight your career journey, achievements, and professional certifications.
                    </p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 2 * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-8 bg-white/80 backdrop-blur-sm border-4 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Code className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-2xl text-gray-900 font-semibold">Connect & Network</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Link your social profiles and coding platforms to expand your professional network.
                    </p>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">About</h2>
                  </div>
                  {isEditing ? (
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full min-h-[120px] border-0 p-0 bg-transparent focus:ring-0 resize-none text-gray-700 leading-relaxed"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <>
                      <p className="text-gray-700 leading-relaxed mb-4">{formData.bio || 'Tell us about yourself...'}</p>
                      <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium">
                        Read more
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </>
                  )}
                </Card>
              </motion.div>

              {/* Experience Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-xl border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold">Experience</h3>
                          <Input
                            value={formData.experience}
                            onChange={(e) => setFormData({...formData, experience: e.target.value})}
                            placeholder="Years of experience (e.g., 14 years)"
                            className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                          />
                        </div>
                      ) : (
                        <>
                          <h3 className="text-2xl font-bold mb-2">Experience</h3>
                          <p className="text-blue-100 text-lg">{formData.experience || 'Add your experience'} of experience</p>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Experience Chart */}
                      {formData.experience && !isEditing && (
                        <div className="flex-shrink-0">
                          <svg ref={experienceChartRef} className="w-20 h-20"></svg>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <Award className="w-6 h-6" />
                        </div>
                        <ChevronRight className="w-8 h-8 text-white/70" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Skills Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                  <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                        <Textarea
                          value={formData.skills.join(', ')}
                          onChange={(e) => setFormData({...formData, skills: e.target.value.split(',').map(s => s.trim())})}
                          placeholder="Enter your skills separated by commas"
                          rows={4}
                          className="w-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Skills Chart */}
                      {formData.skills.length > 0 && (
                        <div className="mb-6">
                          <div className="flex justify-center">
                            <svg ref={skillsChartRef} className="w-full max-w-md"></svg>
                          </div>
                        </div>
                      )}

                      {/* Primary Skills */}
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-3">
                          {formData.skills.slice(0, 3).map((skill, index) => (
                            <Badge
                              key={index}
                              className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 text-sm font-medium rounded-full"
                            >
                              {skill || 'Add skills'}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Secondary Skills */}
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {formData.skills.slice(3).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1 text-sm rounded-full"
                            >
                              {skill || 'Add more skills'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </Card>
              </motion.div>

              {/* Work History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                  <div className="flex items-center gap-3 mb-6">
                    <Briefcase className="w-6 h-6 text-green-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Work History</h2>
                  </div>
                  <div className="space-y-6">
                    {formData.workHistory.map((job, index) => (
                      <div key={index} className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">{job.company.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="space-y-3">
                              <Input
                                value={job.position}
                                onChange={(e) => {
                                  const newWorkHistory = [...formData.workHistory];
                                  newWorkHistory[index].position = e.target.value;
                                  setFormData({...formData, workHistory: newWorkHistory});
                                }}
                                placeholder="Job position"
                                className="text-lg font-semibold"
                              />
                              <Input
                                value={job.company}
                                onChange={(e) => {
                                  const newWorkHistory = [...formData.workHistory];
                                  newWorkHistory[index].company = e.target.value;
                                  setFormData({...formData, workHistory: newWorkHistory});
                                }}
                                placeholder="Company name"
                                className="text-blue-600 font-medium"
                              />
                              <Input
                                value={job.period}
                                onChange={(e) => {
                                  const newWorkHistory = [...formData.workHistory];
                                  newWorkHistory[index].period = e.target.value;
                                  setFormData({...formData, workHistory: newWorkHistory});
                                }}
                                placeholder="Duration (e.g., Jan 2020 - Present)"
                                className="text-sm"
                              />
                            </div>
                          ) : (
                            <>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.position}</h3>
                              <p className="text-blue-600 font-medium mb-2">{job.company}</p>
                              <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>{job.period}</span>
                                {job.current && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">Current</Badge>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Profile Stats from RightPanel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Profile Analytics</h3>
                  </div>

                  {/* Profile Views Chart */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Profile Views (This Week)</h4>
                    <div className="h-24 bg-gray-50 rounded-lg p-2">
                      <svg className="w-full h-full">
                        <defs>
                          <linearGradient id="profileViewsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2"/>
                          </linearGradient>
                        </defs>
                        {/* Simple line chart representation */}
                        <polyline
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          points="10,60 30,40 50,50 70,30 90,35 110,25 130,40"
                        />
                        <polyline
                          fill="url(#profileViewsGradient)"
                          stroke="none"
                          points="10,60 30,40 50,50 70,30 90,35 110,25 130,40 130,80 110,80 90,80 70,80 50,80 30,80 10,80"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="space-y-3">
                    {(() => {
                      // Calculate user-specific applied and bookmarked jobs
                      const appliedKey = `jobsAppliedPerDay_${user?.id}`;
                      const bookmarkedKey = `jobsBookmarkedPerDay_${user?.id}`;

                      const appliedStored = localStorage.getItem(appliedKey);
                      const bookmarkedStored = localStorage.getItem(bookmarkedKey);

                      let appliedJobs = 0;
                      let bookmarkedJobs = 0;

                      if (appliedStored) {
                        const appliedData = JSON.parse(appliedStored);
                        appliedJobs = Object.values(appliedData.days || {}).reduce((sum, count) => sum + count, 0);
                      }

                      if (bookmarkedStored) {
                        const bookmarkedData = JSON.parse(bookmarkedStored);
                        bookmarkedJobs = Object.values(bookmarkedData.days || {}).reduce((sum, count) => sum + count, 0);
                      }

                      return (
                        <>
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-600">Search Results</p>
                              <p className="text-lg font-bold text-gray-900">247</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <FileText className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-600">Applied Jobs</p>
                              <p className="text-lg font-bold text-gray-900">{appliedJobs}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <TrendingUp className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-600">Bookmarked Jobs</p>
                              <p className="text-lg font-bold text-gray-900">{bookmarkedJobs}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <Briefcase className="w-4 h-4 text-orange-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-600">Experience</p>
                              <p className="text-lg font-bold text-gray-900">{formData.experience || '0'} Years</p>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </Card>
              </motion.div>

              {/* Current Work */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Briefcase className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">Current Work</h3>
                  </div>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Position</label>
                        <Input
                          value={formData.currentPosition}
                          onChange={(e) => setFormData({...formData, currentPosition: e.target.value})}
                          placeholder="Your current position"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Company</label>
                        <Input
                          value={formData.currentCompany}
                          onChange={(e) => setFormData({...formData, currentCompany: e.target.value})}
                          placeholder="Your current company"
                          className="w-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${profileData.currentCompany.logoColor} rounded-xl flex items-center justify-center`}>
                        <span className="text-white font-bold text-lg">{profileData.currentCompany.logo}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{formData.currentPosition || 'Your Position'}</h4>
                        <p className="text-gray-600 text-sm">{formData.currentCompany || 'Your Company'}</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* Certificates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-lg font-bold text-gray-900">Certificates</h3>
                  </div>
                  {isEditing ? (
                    <div className="space-y-4">
                      {formData.certificates.map((cert, index) => (
                        <div key={index} className="space-y-3 p-4 border border-gray-200 rounded-lg">
                          <Input
                            value={cert.name}
                            onChange={(e) => {
                              const newCertificates = [...formData.certificates];
                              newCertificates[index].name = e.target.value;
                              setFormData({...formData, certificates: newCertificates});
                            }}
                            placeholder="Certificate name"
                            className="font-medium"
                          />
                          <Input
                            value={cert.issuer}
                            onChange={(e) => {
                              const newCertificates = [...formData.certificates];
                              newCertificates[index].issuer = e.target.value;
                              setFormData({...formData, certificates: newCertificates});
                            }}
                            placeholder="Issuing organization"
                          />
                          <Input
                            value={cert.date}
                            onChange={(e) => {
                              const newCertificates = [...formData.certificates];
                              newCertificates[index].date = e.target.value;
                              setFormData({...formData, certificates: newCertificates});
                            }}
                            placeholder="Date obtained"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.certificates.map((cert, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{cert.name}</h4>
                            <p className="text-gray-600 text-sm">{cert.issuer}</p>
                            <p className="text-gray-500 text-xs">{cert.date}</p>
                          </div>
                          {cert.verified && (
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-red-50 rounded-2xl p-8 border border-red-200"
      >
        <h3 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h3>
        <p className="text-red-700 mb-6">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button
          onClick={handleDeleteAccount}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
        </Button>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xl">GrabIt</span>
              </div>
              <p className="text-gray-400 mb-6">
                Connecting talent with opportunity. Find your dream job today.
              </p>
            </div>

            <div>
              <h4 className="text-white mb-4">For Job Seekers</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Browse Jobs</a></li>
                <li><a href="/jobs" className="hover:text-white transition-colors">Companies</a></li>
                <li><a href="#advice" className="hover:text-white transition-colors">Career Advice</a></li>
                <li><a href="#profile" className="hover:text-white transition-colors">My Profile</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4">For Employers</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#post" className="hover:text-white transition-colors">Post a Job</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#candidates" className="hover:text-white transition-colors">Browse Candidates</a></li>
                <li><a href="#resources" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 GrabIt. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#cookie" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}