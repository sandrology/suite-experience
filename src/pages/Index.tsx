import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ExperienceCard from '../components/experiences/ExperienceCard';
import { Experience } from '../types/experience';
import { useLanguage } from '../context/LanguageContext';
import { getExperiences, initializeSupabaseData } from '../services/experienceService';

const Index = () => {
  const { t } = useLanguage();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to load experiences
  const loadExperiences = async () => {
    setLoading(true);
    try {
      // Initialize Supabase data if needed
      await initializeSupabaseData();
      
      // Then load experiences
      const loadedExperiences = await getExperiences();
      setExperiences(loadedExperiences);
      console.log('Home loaded experiences:', loadedExperiences);
    } catch (error) {
      console.error('Error loading experiences:', error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load experiences initially
    loadExperiences();
    
    // Add event listeners for custom event
    const handleExperiencesUpdated = () => {
      console.log('Experiences updated event detected in Home');
      loadExperiences();
    };
    
    // Listen for custom events
    window.addEventListener('experiencesUpdated', handleExperiencesUpdated);
    
    return () => {
      window.removeEventListener('experiencesUpdated', handleExperiencesUpdated);
    };
  }, []);

  // Filter only enabled experiences for the home page (removed the slice)
  const featuredExperiences = experiences.filter(exp => exp.enabled);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section - ridotta in altezza */}
      <div className="bg-primary relative">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container-custom py-12 md:py-20 relative z-10 text-center">
          <h1 className="heading-xl text-white mb-4">
            {t('discover')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            {t('discoverSubtitle')}
          </p>
        </div>
      </div>

      {/* Featured Experiences */}
      <div id="featured" className="container-custom py-16 md:py-24">
        <div className="flex justify-between items-center mb-8">
          <h2 className="heading-lg">{t('featuredExperiences')}</h2>
          <div className="text-sm text-gray-500">
            {loading ? (
              <span>{t('loading')}</span>
            ) : (
              <span>{featuredExperiences.length} {t('experiencesAvailable')}</span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredExperiences.length > 0 ? (
              featuredExperiences.map(experience => (
                <ExperienceCard key={experience.id} experience={experience} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">{t('noExperiences')}</p>
                <Link to="/admin" className="btn-primary mt-4 inline-block">
                  {t('goToAdmin')}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Index;