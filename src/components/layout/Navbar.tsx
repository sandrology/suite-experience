
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, LogOut } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const isAdminPage = location.pathname.includes('/admin');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'it' : 'en');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="https://suitenumero5.s3.us-east-1.amazonaws.com/img/logoorizontale.png" 
              alt="Logo" 
              className="h-10" 
            />
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-800 hover:text-primary transition-colors">
              {t('home')}
            </Link>
            
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 text-gray-600 hover:text-primary"
            >
              <Globe className="h-5 w-5" />
              <span>{language.toUpperCase()}</span>
            </button>
            
            {isAuthenticated && isAdminPage ? (
              <button 
                onClick={handleLogout} 
                className="flex items-center text-gray-600 hover:text-red-500"
              >
                <LogOut className="h-5 w-5 mr-1" />
                {t('logout')}
              </button>
            ) : (
              <Link to="/admin/login" className="btn-primary">
                {t('admin')}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleLanguage} className="mr-4">
              <Globe className="h-6 w-6 text-gray-600" />
            </button>
            <button onClick={toggleMenu} className="focus:outline-none">
              {isOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-3 animate-fade-in">
            <Link 
              to="/" 
              className="block py-2 text-gray-800 hover:text-primary"
              onClick={toggleMenu}
            >
              {t('home')}
            </Link>
            {isAuthenticated && isAdminPage ? (
              <button 
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }} 
                className="block py-2 text-gray-800 hover:text-red-500 w-full text-left"
              >
                {t('logout')}
              </button>
            ) : (
              <Link 
                to="/admin/login" 
                className="block py-2 text-gray-800 hover:text-primary"
                onClick={toggleMenu}
              >
                {t('admin')}
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
