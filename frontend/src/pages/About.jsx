import React from 'react';
import {
  AcademicCapIcon,
  EyeIcon,
  HeartIcon,
  StarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Footer from '../components/Footer';

const About = () => {
  const values = [
    {
      icon: AcademicCapIcon,
      title: 'Flexible Learning',
      description: 'Distance and correspondence education designed for working professionals and busy learners',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: HeartIcon,
      title: 'Personalized Support',
      description: 'Guided admissions process with ongoing support throughout your educational journey',
      color: 'bg-slate-100 text-slate-600'
    },
    {
      icon: LightBulbIcon,
      title: 'University Partnerships',
      description: 'Access to recognized programs from reputed universities across India',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: UserGroupIcon,
      title: 'Career Advancement',
      description: 'Programs designed to help working professionals advance their careers',
      color: 'bg-indigo-100 text-indigo-600'
    }
  ];

  const achievements = [
    { number: 'Karnataka', label: 'Based' },
    { number: '10+', label: 'Years of Excellence' },
    { number: '5000+', label: 'Students Guided' },
    { number: '25+', label: 'Partner Universities' },
    { number: '100+', label: 'Programs Available' },
    { number: '2', label: 'Office Locations' }
  ];

  const features = [
    'Distance and correspondence education facilitation',
    'Undergraduate, postgraduate, and diploma programs',
    'Flexible schedules for working professionals',
    'Guidance through admissions and university coordination',
    'Multiple program streams: BBA, MBA, BA, MA, B.Com, M.Com, B.Sc, M.Sc, Social Work, PhD',
    'Bangalore-based assistance with nationwide options'
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <AcademicCapIcon className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              About Jnanasiri Educational Institute
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Your trusted partner for distance and correspondence education - facilitating 
              flexible learning pathways across undergraduate, postgraduate, and diploma programs
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Who We Are
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Jnanasiri Educational Institute is a facilitator of distance and correspondence education 
              based in Karnataka. We specialize in providing flexible educational pathways across 
              undergraduate, postgraduate, and diploma programs offered by multiple universities, 
              emphasizing convenience and choice for learners.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Our approach is contact-first - we encourage visitors to connect with us via phone or email 
              to start their educational journey. We provide comprehensive guidance through admissions 
              and coordination with affiliated partner universities nationwide.
            </p>
          </div>

          {/* Achievement Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-lg transition-all duration-300">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">{achievement.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white rounded-lg border border-slate-200 p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                <EyeIcon className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                To provide quality education that develops intellectual curiosity, 
                critical thinking, and strong moral values in our students. We are 
                committed to creating an environment where every student can thrive 
                academically, socially, and personally.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-lg border border-slate-200 p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center mb-6">
                <GlobeAltIcon className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                To be recognized as a leading educational institution that prepares 
                students for success in an ever-changing global society. We envision 
                creating leaders who will make positive contributions to their 
                communities and the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              <StarIcon className="w-4 h-4 mr-2" />
              Core Values
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our values guide how we facilitate distance education and support our students' success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-lg border border-slate-200 p-6 text-center group hover:shadow-lg transition-all duration-300 transform hover:scale-105" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-700 transition-all duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4">
                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                Why Choose Us
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                Excellence in Every Aspect
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                We provide a holistic educational experience that goes beyond traditional 
                classroom learning. Our comprehensive approach ensures that every student 
                receives the support they need to succeed.
              </p>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 group">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-1 group-hover:scale-110 transition-transform">
                      <CheckCircleIcon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-slate-700 group-hover:text-slate-900 transition-colors">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-slate-900 text-white rounded-lg p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-6">Ready to Join Us?</h3>
                  <p className="text-slate-200 mb-8 leading-relaxed">
                    Take the first step towards a brighter future. Apply for admission 
                    and become part of our excellence tradition.
                  </p>
                  <div className="space-y-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 w-full group flex items-center justify-center">
                      Apply for Admission
                      <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="border-2 border-slate-300 text-slate-300 hover:bg-white hover:text-slate-900 px-8 py-3 rounded-lg font-semibold transition-all duration-300 w-full">
                      Download Brochure
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Background Decorations */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-primary-300/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary-300/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
