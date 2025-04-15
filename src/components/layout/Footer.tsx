
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary relative">
      {/* Overlay con stessa opacità dell'hero */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="container-custom py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <img 
              src="https://suitenumero5.s3.us-east-1.amazonaws.com/img/scrittaorizzontalebianca.png" 
              alt="Logo" 
              className="h-12 mb-4 brightness-200"
            />
          </div>
          
          {/* Contact 
          <div>
            <h5 className="font-semibold text-lg mb-4 text-white">Contact Us</h5>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Phone className="text-gray-300" />
                <span className="text-gray-300">+39 348 3103720</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-gray-300" />
                <span className="text-gray-300">info@suitenumero5.it</span>
              </li>
            </ul>
          </div>
            */}

          
          
          {/* Quick Links 
          <div>
            <h5 className="font-semibold text-lg mb-4 text-white">Quick Links</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">
                  {t('admin')}
                </Link>
              </li>
            </ul>
          </div>*/}
          
          {/* Social 
          <div>
            <h5 className="font-semibold text-lg mb-4 text-white">Follow Us</h5>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>*/}
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Suite Numero 5. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-8 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
