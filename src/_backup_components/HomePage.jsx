import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HomePage({ onLoginClick, onSignUpClick, onNavigateToBlog }) {
  const [activeTab, setActiveTab] = useState("Forward Thinking");

  const cultureTags = [
    "Friendly", "Autonomous", "Islamic mind", "Curious", "Fast Paced", "Ego free",
    "Curious", "Empowering", "Forward Thinking", "Fast Paced", "Autonomous",
    "Islamic mind", "Curious", "Ego free"
  ];

  const featureCards = [
    {
      title: "Apply to humans",
      description: "An employee is someone who gets paid to work for a person or company. Workers don't need to.",
      bgColor: "from-blue-200 to-purple-200",
      borderColor: "border-black"
    },
    {
      title: "Instantly stand out",
      description: "An employee is someone who gets paid to work for a person or company. Workers don't need to.",
      bgColor: "from-green-200 to-green-300",
      borderColor: "border-black"
    },
    {
      title: "Real time feedback",
      description: "An employee is someone who gets paid to work for a person or company. Workers don't need to.",
      bgColor: "from-pink-200 to-red-200",
      borderColor: "border-black"
    }
  ];

  const trendingJobs = [
    {
      company: "Microsoft",
      logo: "https://images.unsplash.com/photo-1633114128378-3a6e4e5b3a8d?w=80&h=80&fit=crop",
      jobType: "Full Time",
      title: "Junior Ui Ux Designer",
      location: "California",
      description: "WS For Startups. Quality Results In 1 Minute or Less! Search for Aws For Startups",
      featured: false
    },
    {
      company: "Microsoft",
      logo: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=80&h=80&fit=crop",
      jobType: "Full Time",
      title: "Senior Font End Developer",
      location: "California",
      description: "WS For Startups. Quality Results In 1 Minute or Less! Search for Aws For Startups",
      featured: true
    },
    {
      company: "Google",
      logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=80&h=80&fit=crop",
      jobType: "Full Time",
      title: "Junior Ui Ux Designer",
      location: "California",
      description: "WS For Startups. Quality Results In 1 Minute or Less! Search for Aws For Startups",
      featured: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#C5E8D5] border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl text-black">Oy lio</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-black hover:text-gray-700 transition-colors">
                Home
              </a>
              <a href="#jobs" className="text-black hover:text-gray-700 transition-colors">
                Find Jobs
              </a>
              <a href="#alerts" className="text-black hover:text-gray-700 transition-colors">
                Job Alerts
              </a>
              <a href="#advice" className="text-black hover:text-gray-700 transition-colors">
                Career Advice
              </a>
              <a href="#contact" className="text-black hover:text-gray-700 transition-colors">
                Contact
              </a>
            </nav>

            {/* Auth */}
            <div className="flex items-center gap-4">
              <button
                onClick={onLoginClick}
                className="text-black hover:text-gray-700 transition-colors px-4"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#C5E8D5] py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl lg:text-6xl text-black mb-6 leading-tight"
              >
                It has never been easier to hire perfect employee
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg text-gray-800 mb-8 max-w-lg"
              >
                An employee is someone who gets paid to work for a person or company. Workers don't need to work full time to be considered employees.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <Button className="bg-black hover:bg-gray-900 text-white px-8 h-14 rounded-lg">
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="bg-white border-2 border-black text-black hover:bg-gray-50 px-8 h-14 rounded-full flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </div>
                  How It works
                </Button>
              </motion.div>
            </div>

            {/* Right Content - Hero Image with Floating Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main circular image with purple background */}
                <div className="relative w-[500px] h-[500px] mx-auto">
                  {/* Background splatter effect */}
                  <div className="absolute inset-0">
                    <svg viewBox="0 0 500 500" className="w-full h-full">
                      <circle cx="250" cy="250" r="200" fill="#000" opacity="0.8" />
                      {/* Splatter dots around */}
                      {[...Array(20)].map((_, i) => {
                        const angle = (i / 20) * Math.PI * 2;
                        const distance = 220 + Math.random() * 40;
                        const x = 250 + Math.cos(angle) * distance;
                        const y = 250 + Math.sin(angle) * distance;
                        const size = 2 + Math.random() * 4;
                        return <circle key={i} cx={x} cy={y} r={size} fill="#000" />;
                      })}
                    </svg>
                  </div>

                  {/* Purple circular background */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500 rounded-full" />

                  {/* Orange circle for person */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-orange-400 rounded-full overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1635768229592-8c2532d33cb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwZXJzb24lMjBzbWlsaW5nfGVufDF8fHx8MTc2MDg5NzgwMnww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Professional person"
                      className="w-full h-full object-cover object-center scale-125 translate-y-4"
                    />
                  </div>

                  {/* Floating Cards */}
                  {/* Senior Product Designer Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="absolute top-20 right-0 bg-white p-4 rounded-lg shadow-xl border-2 border-black w-64"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-orange-400" />
                      <div>
                        <p className="text-sm text-black">Senior Product Designer</p>
                        <p className="text-xs text-gray-600">California</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Status: Remote</span>
                      <span className="text-black">$43,284 p/m</span>
                    </div>
                  </motion.div>

                  {/* Avatar Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="absolute top-52 right-10 bg-white p-3 rounded-lg shadow-xl border-2 border-black"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400" />
                  </motion.div>

                  {/* Google Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="absolute bottom-32 right-20 bg-white px-4 py-2 rounded-lg shadow-xl border-2 border-black flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-500" />
                    <span className="text-sm text-black">Google CO.</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {featureCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`p-8 bg-gradient-to-br ${card.bgColor} border-4 ${card.borderColor} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300`}>
                  <h3 className="text-2xl text-black mb-4">{card.title}</h3>
                  <p className="text-black text-sm leading-relaxed">
                    {card.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Culture Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl text-white mb-12">
            Find Your Company Culture
          </h2>

          <div className="flex flex-wrap gap-4">
            {cultureTags.map((tag, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                onClick={() => setActiveTab(tag === activeTab ? null : tag)}
                className={`px-6 py-3 rounded-full border-2 border-white transition-all duration-300 ${
                  activeTab === tag
                    ? "bg-white text-black"
                    : "bg-transparent text-white hover:bg-white/10"
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Jobs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl lg:text-5xl text-black">
              Trending Job Right Now
            </h2>
            <button className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors">
              See all
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {trendingJobs.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 bg-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      {job.company === "Microsoft" ? (
                        <div className="w-full h-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white">
                          M
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 via-red-500 via-yellow-500 to-green-500 flex items-center justify-center text-white">
                          G
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-black">{job.company}</p>
                      <p className="text-sm text-gray-600">{job.jobType}</p>
                    </div>
                  </div>

                  <h3 className="text-xl text-black mb-2">{job.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{job.location}</p>
                  <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                    {job.description}
                  </p>

                  <Button
                    className={`w-full ${
                      job.featured
                        ? "bg-black text-white hover:bg-gray-900"
                        : "bg-white border-2 border-black text-black hover:bg-gray-50"
                    } rounded-lg h-12`}
                  >
                    Apply Now
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-32 bg-gradient-to-br from-teal-200 via-cyan-200 to-teal-300 relative overflow-hidden">
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-6xl text-black text-center"
          >
            It's Easy To Find Someone
          </motion.h2>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xl">Oy lio</span>
              </div>
              <p className="text-gray-400 mb-6">
                Connecting talent with opportunity. Find your dream job today.
              </p>
            </div>

            <div>
              <h4 className="text-white mb-4">For Job Seekers</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Companies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Advice</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resume Builder</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4">For Employers</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Post a Job</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Browse Candidates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><button onClick={onNavigateToBlog} className="hover:text-white transition-colors">Blog</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Oy lio. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
