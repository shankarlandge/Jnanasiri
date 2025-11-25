# Learning Management System (LMS) - Janashiri Institute

A comprehensive full-stack Learning Management System built with modern web technologies, featuring role-based authentication, admission management, student portals, and administrative dashboards.

## 🚀 Features

### Public Features
- **Home Page**: Institute overview with modern responsive design
- **About Page**: Detailed institute information and mission
- **Gallery**: Interactive photo gallery of campus and events
- **Contact Form**: Direct communication with institute administration
- **Admission Form**: Online application with photo upload
- **Admission Status Checker**: Real-time application status tracking

### Student Portal
- **Dashboard**: Personal overview and quick access to features
- **Profile Management**: Complete profile with photo upload, personal details, and emergency contact
- **Account Settings**: Security settings, password change, notification preferences
- **Privacy Settings**: Control visibility of profile information
- **ID Card Generation**: Download printable student ID card (PDF/PNG)
- **Secure Authentication**: JWT-based login with student ID or email
- **Notification System**: Customizable email and SMS notifications for:
  - Academic updates and announcements
  - Exam reminders and schedules
  - Fee payment reminders
  - General institute notifications

### Admin Panel
- **Dashboard**: Comprehensive statistics and overview
- **Admission Management**: Review, approve, or reject applications
- **Student Management**: Complete student database with status controls
- **Contact Management**: Handle and respond to inquiries
- **Email Integration**: Automated notifications for all processes
- **Credential Management**: Send login credentials to approved students via email

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite for fast development
- **TailwindCSS** for responsive, modern UI design
- **React Router DOM** for client-side routing
- **Axios** for API communication
- **React Hook Form** for form handling
- **Heroicons** for consistent iconography
- **jsPDF & html-to-image** for ID card generation

### Backend
- **Node.js** with Express.js framework
- **MongoDB Atlas** for cloud database
- **JWT** for secure authentication
- **bcryptjs** for password hashing
- **Multer & Cloudinary** for file upload and storage
- **Nodemailer** for email functionality
- **Express Rate Limiting** for API protection

## 📁 Project Structure

```
LMS_Janashiri/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   │   ├── admin/      # Admin dashboard pages
│   │   │   └── student/    # Student portal pages
│   │   ├── context/        # React Context providers
│   │   ├── utils/          # Utility functions and API
│   │   └── ...
│   ├── public/             # Static assets
│   └── package.json
│
├── backend/                 # Node.js backend API
│   ├── models/             # MongoDB models
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Helper functions
│   ├── scripts/            # Utility scripts
│   └── package.json
│
└── README.md
```



**Built with ❤️ by Sanket Mane**
