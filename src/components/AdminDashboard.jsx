import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  LogOut,
  Upload,
  Plus,
  TrendingUp,
  Users,
  FileText,
  Menu,
  X,
  Bell,
  Search,
  Calendar,
  Trash2,
  MapPin,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { LocationPickerModal } from "./LocationPickerModal";
import { API_BASE_URL } from "./client";

export function AdminDashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Register Company State
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyIndustry, setCompanyIndustry] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [companySize, setCompanySize] = useState("1-10");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add Job State
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobSalary, setJobSalary] = useState("");
  const [jobDeadline, setJobDeadline] = useState("");
  const [jobRoleDetails, setJobRoleDetails] = useState("");
  const [jobType, setJobType] = useState("Full Time");
  const [experienceLevel, setExperienceLevel] = useState("Entry Level");
  const [workLocation, setWorkLocation] = useState("Office");
  const [applicationLink, setApplicationLink] = useState("");
  const [jobs, setJobs] = useState([]);

  // Location Picker State
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [locationPickerTarget, setLocationPickerTarget] = useState(''); // 'company' or 'job'
  const [selectedCompanyLocation, setSelectedCompanyLocation] = useState(null);
  const [selectedJobLocation, setSelectedJobLocation] = useState(null);

  // Fetch companies from database
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/companies`);
      const data = await response.json();

      if (data.success) {
        setCompanies(data.companies);
      } else {
        toast.error('Failed to fetch companies');
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  // Delete company function
  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success("✅ Company deleted successfully");
        // Refresh companies list
        await fetchCompanies();
      } else {
        toast.error(result.error || "Failed to delete company");
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error("Failed to delete company");
    } finally {
      setLoading(false);
    }
  };

  // Load companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }

      try {
        // Show loading state
        toast.loading("Uploading image...", { id: "upload" });

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('image', file);

        // Upload to Cloudinary via backend
        const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          setCompanyLogo(result.imageUrl);
          toast.success("Image uploaded successfully!", { id: "upload" });
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Upload failed: ${error.message}`, { id: "upload" });
      }
    }
  };

  const handleRegisterCompany = async (e) => {
    e.preventDefault();
    
    if (!companyName || !companyDescription) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      
      const companyData = {
        name: companyName,
        logo: companyLogo || "https://images.unsplash.com/photo-1637489981573-e45e9297cb21?w=100&h=100&fit=crop",
        description: companyDescription,
        website: companyWebsite,
        industry: companyIndustry,
        location: selectedCompanyLocation ? {
          address: selectedCompanyLocation.address,
          coordinates: {
            lat: selectedCompanyLocation.lat,
            lng: selectedCompanyLocation.lng
          },
          placeId: selectedCompanyLocation.placeId
        } : companyLocation,
        size: companySize
      };

      const response = await fetch(`${API_BASE_URL}/api/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("✅ Company Registered Successfully", {
          description: `${companyName} has been added to the platform.`,
        });

        // Refresh companies list
        await fetchCompanies();

        // Reset form
        setCompanyName("");
        setCompanyLogo("");
        setCompanyDescription("");
        setCompanyWebsite("");
        setCompanyIndustry("");
        setCompanyLocation("");
        setSelectedCompanyLocation(null);
        setCompanySize("1-10");
      } else {
        toast.error(result.error || "Failed to register company");
      }
    } catch (error) {
      console.error('Error registering company:', error);
      toast.error("Failed to register company");
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();

    if (!selectedCompanyId || !jobTitle || !jobDescription || !jobLocation || !jobSalary || !jobDeadline || !jobRoleDetails || !experienceLevel) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const selectedCompany = companies.find(c => c._id === selectedCompanyId);

      const jobData = {
        job_id: Date.now().toString(),
        title: jobTitle,
        description: jobDescription,
        requirements: jobRoleDetails, // Using role details as requirements
        last_date: jobDeadline,
        company_id: selectedCompanyId,
        salary: jobSalary,
        location: selectedJobLocation ? {
          address: selectedJobLocation.address,
          coordinates: {
            lat: selectedJobLocation.lat,
            lng: selectedJobLocation.lng
          },
          placeId: selectedJobLocation.placeId
        } : jobLocation,
        job_type: jobType,
        experience_level: experienceLevel,
        work_location: workLocation,
        application_link: applicationLink,
      };

      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`💼 Job added successfully`, {
          description: `${jobTitle} has been posted under ${selectedCompany?.name}`,
        });

        // Refresh jobs list
        await fetchJobs();

        // Reset form
        setSelectedCompanyId("");
        setJobTitle("");
        setJobDescription("");
        setJobLocation("");
        setSelectedJobLocation(null);
        setJobSalary("");
        setJobDeadline("");
        setJobRoleDetails("");
        setJobType("Full Time");
        setExperienceLevel("Entry Level");
        setWorkLocation("Office");
        setApplicationLink("");
      } else {
        toast.error(result.error || "Failed to add job");
      }
    } catch (error) {
      console.error('Error adding job:', error);
      toast.error("Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs from database
  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs`);
      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs);
      } else {
        toast.error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    }
  };

  // Delete job function
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success("✅ Job deleted successfully");
        // Refresh jobs list
        await fetchJobs();
      } else {
        toast.error(result.error || "Failed to delete job");
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error("Failed to delete job");
    } finally {
      setLoading(false);
    }
  };

  // Load jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Location picker handlers
  const handleOpenLocationPicker = (target, currentLocation = '') => {
    setLocationPickerTarget(target);
    setLocationPickerOpen(true);
  };

  const handleLocationSelect = (locationData) => {
    if (locationPickerTarget === 'company') {
      setSelectedCompanyLocation(locationData);
      setCompanyLocation(locationData.address);
    } else if (locationPickerTarget === 'job') {
      setSelectedJobLocation(locationData);
      setJobLocation(locationData.address);
    }
    setLocationPickerOpen(false);
  };

  const stats = [
    {
      title: "Total Companies",
      value: companies.length.toString(),
      icon: Building2,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Jobs",
      value: jobs.length.toString(),
      icon: Briefcase,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Active Listings",
      value: jobs.length.toString(),
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Applications",
      value: "0",
      icon: Users,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "register-company", label: "Register Company", icon: Building2 },
    { id: "add-job", label: "Add Job", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-40">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <h1 className="text-xl text-gray-900">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Search className="w-5 h-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || !isMobile) && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-white border-r border-gray-200 z-30 overflow-y-auto"
            >
              <nav className="p-4 space-y-2">
                {navigationItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeSection === item.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </motion.button>
                ))}

                <div className="pt-4 mt-4 border-t border-gray-200">
                  <motion.button
                    onClick={onLogout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </motion.button>
                </div>
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl">
          <AnimatePresence mode="wait">
            {/* Dashboard Overview */}
            {activeSection === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl text-gray-900 mb-2">Dashboard Overview</h2>
                  <p className="text-gray-600">Welcome back! Here's what's happening with your job portal.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 border-0 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                            <p className="text-3xl text-gray-900">{stat.value}</p>
                          </div>
                          <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                            <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{ 
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                            }} />
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Recent Companies */}
                  <Card className="p-6 border-0 shadow-lg shadow-gray-200/50">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl text-gray-900">Recent Companies</h3>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-50">
                        {companies.length} Total
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      {companies.slice(0, 3).map((company, index) => (
                        <motion.div
                          key={company._id || company.id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <ImageWithFallback
                            src={company.logo}
                            alt={company.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 truncate">{company.name}</p>
                            <p className="text-xs text-gray-500 truncate">{company.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>

                  {/* Recent Jobs */}
                  <Card className="p-6 border-0 shadow-lg shadow-gray-200/50">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl text-gray-900">Recent Jobs</h3>
                      <Badge variant="secondary" className="bg-purple-50 text-purple-600 hover:bg-purple-50">
                        {jobs.length} Total
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      {jobs.length === 0 ? (
                        <div className="text-center py-8">
                          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-sm text-gray-500">No jobs posted yet</p>
                        </div>
                      ) : (
                        jobs.slice(0, 3).map((job, index) => (
                          <motion.div
                            key={job.id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <p className="text-sm text-gray-900 mb-1">{job.title}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{job.companyName}</span>
                              <span>•</span>
                              <span>{typeof job.location === 'object' ? job.location.address : job.location}</span>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* Register Company Section */}
            {activeSection === "register-company" && (
              <motion.div
                key="register-company"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl text-gray-900 mb-2">Register Company</h2>
                  <p className="text-gray-600">Add a new company to the job portal platform.</p>
                </div>

                {/* Form Card */}
                <Card className="p-8 border-0 shadow-lg shadow-gray-200/50 backdrop-blur-xl bg-white/90 mb-8">
                  <form onSubmit={handleRegisterCompany} className="space-y-6">
                    <div>
                      <Label htmlFor="company-name" className="text-gray-900">Company Name *</Label>
                      <Input
                        id="company-name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter company name"
                        className="mt-2 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="company-logo" className="text-gray-900">Company Logo</Label>
                      <div className="mt-2 flex items-center gap-6">
                        {companyLogo && (
                          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-200">
                            <img src={companyLogo} alt="Logo preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <label
                            htmlFor="company-logo"
                            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer"
                          >
                            <Upload className="w-5 h-5 text-gray-600" />
                            <span className="text-sm text-gray-600">Upload Logo</span>
                          </label>
                          <input
                            id="company-logo"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="company-description" className="text-gray-900">Company Description *</Label>
                      <Textarea
                        id="company-description"
                        value={companyDescription}
                        onChange={(e) => setCompanyDescription(e.target.value)}
                        placeholder="Brief description about the company"
                        className="mt-2 min-h-32 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="company-website" className="text-gray-900">Website</Label>
                        <Input
                          id="company-website"
                          value={companyWebsite}
                          onChange={(e) => setCompanyWebsite(e.target.value)}
                          placeholder="https://company.com"
                          className="mt-2 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                      </div>

                      <div>
                        <Label htmlFor="company-industry" className="text-gray-900">Industry</Label>
                        <Input
                          id="company-industry"
                          value={companyIndustry}
                          onChange={(e) => setCompanyIndustry(e.target.value)}
                          placeholder="e.g., Technology, Healthcare, Finance"
                          className="mt-2 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="company-location" className="text-gray-900">Location</Label>
                        <div className="mt-2">
                          <Input
                            id="company-location"
                            value={companyLocation}
                            onChange={(e) => setCompanyLocation(e.target.value)}
                            placeholder="e.g., San Francisco, CA"
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full"
                            onClick={() => handleOpenLocationPicker('company', companyLocation)}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            Pick Location from Map
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="company-size" className="text-gray-900">Company Size</Label>
                        <Select value={companySize} onValueChange={setCompanySize}>
                          <SelectTrigger className="mt-2 h-12 border-gray-200">
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-200">51-200 employees</SelectItem>
                            <SelectItem value="201-500">201-500 employees</SelectItem>
                            <SelectItem value="501-1000">501-1000 employees</SelectItem>
                            <SelectItem value="1000+">1000+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-purple-500/30 disabled:opacity-50"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      {loading ? "Registering..." : "Register Company"}
                    </Button>
                  </form>
                </Card>

                {/* Companies List */}
                <div className="mb-4">
                  <h3 className="text-xl text-gray-900 mb-6">Registered Companies ({companies.length})</h3>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading companies...</p>
                  </div>
                ) : companies.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No companies registered yet</p>
                    <p className="text-sm text-gray-400">Register your first company above</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company, index) => (
                    <motion.div
                      key={company._id || company.id || index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 border-0 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-start gap-4 mb-4">
                          <ImageWithFallback
                            src={company.logo}
                            alt={company.name}
                            className="w-16 h-16 rounded-2xl object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg text-gray-900 mb-1 truncate">{company.name}</h4>
                            <Badge variant="secondary" className="bg-green-50 text-green-600 text-xs">
                              Active
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteCompany(company._id || company.id)}
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3">{company.description}</p>
                      </Card>
                    </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Add Job Section */}
            {activeSection === "add-job" && (
              <motion.div
                key="add-job"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl text-gray-900 mb-2">Add Job Posting</h2>
                  <p className="text-gray-600">Create a new job listing for registered companies.</p>
                </div>

                {/* Form Card */}
                <Card className="p-8 border-0 shadow-lg shadow-gray-200/50 backdrop-blur-xl bg-white/90 max-w-3xl">
                  <form onSubmit={handleAddJob} className="space-y-6">
                    <div>
                      <Label htmlFor="company-select" className="text-gray-900">Select Company *</Label>
                      <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId} required>
                        <SelectTrigger className="mt-2 h-12 border-gray-200">
                          <SelectValue placeholder="Choose a company" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company._id || company.id} value={company._id || company.id}>
                              <div className="flex items-center gap-2">
                                <ImageWithFallback
                                  src={company.logo}
                                  alt={company.name}
                                  className="w-6 h-6 rounded object-cover"
                                />
                                <span>{company.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="job-title" className="text-gray-900">Job Title *</Label>
                      <Input
                        id="job-title"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g., Senior Frontend Developer"
                        className="mt-2 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="job-description" className="text-gray-900">Job Description *</Label>
                      <Textarea
                        id="job-description"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Describe the role, responsibilities, and requirements"
                        className="mt-2 min-h-32 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="job-location" className="text-gray-900">Location *</Label>
                        <div className="mt-2">
                          <Input
                            id="job-location"
                            value={jobLocation}
                            onChange={(e) => setJobLocation(e.target.value)}
                            placeholder="e.g., San Francisco, CA"
                            className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                            required
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full"
                            onClick={() => handleOpenLocationPicker('job', jobLocation)}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            Pick Location from Map
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="job-salary" className="text-gray-900">Salary Range *</Label>
                        <Input
                          id="job-salary"
                          value={jobSalary}
                          onChange={(e) => setJobSalary(e.target.value)}
                          placeholder="e.g., $100K - $150K"
                          className="mt-2 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="job-deadline" className="text-gray-900">Application Deadline *</Label>
                      <div className="relative mt-2">
                        <Input
                          id="job-deadline"
                          type="date"
                          value={jobDeadline}
                          onChange={(e) => setJobDeadline(e.target.value)}
                          className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                          required
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="job-role-details" className="text-gray-900">Role Details *</Label>
                      <Textarea
                        id="job-role-details"
                        value={jobRoleDetails}
                        onChange={(e) => setJobRoleDetails(e.target.value)}
                        placeholder="Detailed description of the role, responsibilities, and what the candidate will be doing"
                        className="mt-2 min-h-40 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="application-link" className="text-gray-900">Application Link</Label>
                      <Input
                        id="application-link"
                        value={applicationLink}
                        onChange={(e) => setApplicationLink(e.target.value)}
                        placeholder="https://company.com/careers/job-id"
                        className="mt-2 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                      />
                    </div>

                    {/* Job Type */}
                    <div>
                      <Label className="text-gray-900">Job Type *</Label>
                      <Select value={jobType} onValueChange={setJobType} required>
                        <SelectTrigger className="mt-2 h-12 border-gray-200">
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full Time">Full Time</SelectItem>
                          <SelectItem value="Part Time">Part Time</SelectItem>
                          <SelectItem value="Freelance">Freelance</SelectItem>
                          <SelectItem value="Volunteer">Volunteer</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Experience Level */}
                    <div>
                      <Label className="text-gray-900">Experience Level *</Label>
                      <Select value={experienceLevel} onValueChange={setExperienceLevel} required>
                        <SelectTrigger className="mt-2 h-12 border-gray-200">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Entry Level">Entry Level</SelectItem>
                          <SelectItem value="Mid Level">Mid Level</SelectItem>
                          <SelectItem value="Senior Level">Senior Level</SelectItem>
                          <SelectItem value="Managerial">Managerial</SelectItem>
                          <SelectItem value="Executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Work Location */}
                    <div>
                      <Label className="text-gray-900">Work Location</Label>
                      <Select value={workLocation} onValueChange={setWorkLocation}>
                        <SelectTrigger className="mt-2 h-12 border-gray-200">
                          <SelectValue placeholder="Select work location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Office">Office</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                          <SelectItem value="Hybrid">WFA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-purple-500/30"
                    >
                      <Briefcase className="w-5 h-5 mr-2" />
                      Add Job Posting
                    </Button>
                  </form>
                </Card>

                {/* Jobs List */}
                {jobs.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-xl text-gray-900 mb-6">Posted Jobs ({jobs.length})</h3>
                    <div className="grid gap-4">
                      {jobs.map((job, index) => (
                        <motion.div
                          key={job.id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="p-6 border-0 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all duration-300 group">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="text-lg text-gray-900 mb-2">{job.title}</h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                  <span className="flex items-center gap-1.5">
                                    <Building2 className="w-4 h-4" />
                                    {job.company_id?.name || 'Unknown Company'}
                                  </span>
                                  <span>{typeof job.location === 'object' ? job.location.address : job.location}</span>
                                  <Badge variant="secondary" className="bg-green-50 text-green-600">
                                    {job.salary}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  Deadline: {new Date(job.last_date).toLocaleDateString()}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteJob(job._id)}
                                  disabled={loading}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={locationPickerOpen}
        onClose={() => setLocationPickerOpen(false)}
        onLocationSelect={handleLocationSelect}
        initialLocation={locationPickerTarget === 'company' ? companyLocation : jobLocation}
      />
    </div>
  );
}