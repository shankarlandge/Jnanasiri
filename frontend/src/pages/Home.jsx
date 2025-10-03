import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon,
  UserGroupIcon,
  TrophyIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  GlobeAltIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import Footer from '../components/Footer';

const Home = () => {
  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Flexible Distance Learning',
      description: 'Comprehensive distance and correspondence education programs designed for working professionals and students seeking flexible pathways.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: UserGroupIcon,
      title: 'Partner Universities',
      description: 'Access to recognized programs from reputed universities across India with guided admissions support and coordination.',
      color: 'bg-slate-100 text-slate-600'
    },
    {
      icon: TrophyIcon,
      title: 'Proven Track Record',
      description: 'Years of experience in facilitating quality distance education with successful student placements and career advancement.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: SparklesIcon,
      title: 'Comprehensive Support',
      description: 'Complete guidance through admissions process with ongoing support throughout your educational journey.',
      color: 'bg-indigo-100 text-indigo-600'
    }
  ];

  const achievements = [
    { number: '10+', label: 'Years of Excellence', icon: CheckBadgeIcon },
    { number: '5000+', label: 'Students Guided', icon: AcademicCapIcon },
    { number: '25+', label: 'Partner Universities', icon: GlobeAltIcon },
    { number: '100+', label: 'Programs Available', icon: UserGroupIcon }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-slate-900">
              Welcome to 
              <span className="block text-blue-600 mt-2">
                Jnanasiri Educational Institute
              </span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Upgrade your career with flexible distance learning - Choose from undergraduate, 
              postgraduate, and diploma programs delivered by reputed universities across India
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/admission"
                className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors group inline-flex items-center justify-center"
              >
                Apply for Admission
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors group inline-flex items-center justify-center"
              >
                Learn More
                <GlobeAltIcon className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              <LightBulbIcon className="w-4 h-4 mr-2" />
              Why Choose Us
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Distance Learning Excellence
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We facilitate distance and correspondence education with recognized programs from partner universities, 
              offering flexible schedules for working professionals and personalized guidance throughout your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-lg border border-slate-200 p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievement Stats Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Our Achievements Speak
            </h2>
            <p className="text-lg text-slate-600">
              Numbers that reflect our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg border border-slate-200 p-6 text-center hover:shadow-lg transition-all duration-300">
                  <Icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students who have achieved their dreams with us. 
            Your success story begins here.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/admission"
              className="bg-white text-blue-600 hover:bg-slate-100 font-semibold text-lg px-8 py-4 rounded-lg transition-colors group inline-flex items-center justify-center"
            >
              Apply Now
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold text-lg px-8 py-4 rounded-lg transition-colors group inline-flex items-center justify-center"
            >
              Contact Us
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
