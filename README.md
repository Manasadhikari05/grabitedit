# GrabIt - Job Search Platform

A modern, full-stack job search platform built with React, Node.js, Express, and MongoDB. Connect job seekers with opportunities through an intuitive, AI-powered interface.

## 🚀 Features

### For Job Seekers
- **Smart Job Discovery**: AI-powered job recommendations based on skills and interests
- **Advanced Filtering**: Search by location, salary, job type, and experience level
- **Application Tracking**: Monitor application status and history
- **Bookmark Jobs**: Save interesting opportunities for later
- **Career Insights**: Get personalized career guidance and trends
- **Discussion Forum**: Connect with other professionals and share knowledge

### For Employers
- **Job Posting**: Create and manage job listings with detailed requirements
- **Applicant Management**: Track and manage job applications
- **Analytics Dashboard**: Monitor hiring metrics and performance
- **Company Branding**: Showcase your company culture and values

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Cloudinary** - Image hosting and management

### Key Libraries
- **DiceBear Avatars** - Custom user avatars
- **Spline** - 3D interactive scenes
- **React Hot Toast** - Notification system

## 📁 Project Structure

```
job-search-platform/
├── backend/                 # Express.js server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Custom middleware
│   └── config/             # Configuration files
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   └── utils/             # Helper functions
├── public/                 # Static assets
└── dist/                   # Build output
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Manasadhikari05/job-search-websute-.git
   cd job-search-platform
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Environment Setup**

   Create `backend/config.env`:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/grabit
   JWT_SECRET=your_jwt_secret_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the application**
   ```bash
   # Start backend server (from root directory)
   npm run server

   # In another terminal, start frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run server` - Start backend server with nodemon
- `npm start` - Start backend server

## 📊 Key Features Implementation

### Job Application Tracking
- Real-time applicant count display on job cards
- Application status tracking (applied, viewed, shortlisted)
- User dashboard with application history

### Smart Recommendations
- AI-powered job matching based on user skills
- Personalized recommendations using skill-based scoring
- Trending jobs and popular categories

### Interactive UI Components
- 3D Spline scenes for enhanced visual appeal
- Smooth animations with Framer Motion
- Responsive design for all devices
- Dark/light theme support

### Discussion Platform
- Community forum for job seekers
- Post creation with rich text support
- Like and comment functionality
- Image uploads with Cloudinary integration

## 🔐 Authentication & Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and API endpoints
- Secure file upload handling

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Accessible UI components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Manas Adhikari** - *Initial work* - [GitHub](https://github.com/Manasadhikari05)

## 🙏 Acknowledgments

- React community for amazing documentation
- Tailwind CSS for the utility-first approach
- MongoDB for the flexible database solution
- All contributors and users of this platform

---

**GrabIt** - Connecting talent with opportunity through technology and empathy.