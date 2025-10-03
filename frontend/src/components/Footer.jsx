import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
    { name: 'Admission', path: '/admission' },
    { name: 'Student Login', path: '/login' }
  ];

  const programs = [
    'Undergraduate Programs',
    'Postgraduate Programs', 
    'Diploma Courses',
    'Distance Learning',
    'Correspondence Education',
    'Professional Courses'
  ];

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <AcademicCapIcon className="h-8 w-8 text-blue-400 mr-3" />
              <h3 className="text-xl font-bold">Jnanasiri Educational Institute</h3>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              A leading educational institute providing flexible distance and correspondence education 
              programs through recognized universities across India.
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div className="text-sm text-slate-300">
                  <p>162/252, 1st Floor, Magadi Main Road,</p>
                  <p>Sunkadakatte, Bengaluru,</p>
                  <p>Karnataka, India - 560091</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a 
                  href="mailto:jnanasiriinstitute@gmail.com" 
                  className="text-sm text-slate-300 hover:text-blue-400 transition-colors"
                >
                  jnanasiriinstitute@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-slate-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Programs Offered</h4>
            <ul className="space-y-3">
              {programs.map((program, index) => (
                <li key={index} className="text-slate-300 text-sm">
                  {program}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Details */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Company Information</h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div>
                <p className="font-medium text-slate-200">CIN:</p>
                <p>U80900KA2021PTC155154</p>
              </div>
              <div>
                <p className="font-medium text-slate-200">Registration Number:</p>
                <p>155154</p>
              </div>
              <div>
                <p className="font-medium text-slate-200">Incorporated:</p>
                <p>December 2, 2021</p>
              </div>
              <div>
                <p className="font-medium text-slate-200">ROC:</p>
                <p>ROC Bangalore</p>
              </div>
              <div>
                <p className="font-medium text-slate-200">Activity:</p>
                <p>Other Education (NIC: 8090)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-slate-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} Jnanasiri Educational Institute Private Limited. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <span>Company Status: Active</span>
              <span>•</span>
              <span>Private Limited Company</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
