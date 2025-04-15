
import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container-custom py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="heading-lg mb-6 text-center">{t('aboutUs')}</h1>
          
          <div className="max-w-3xl mx-auto">
            <div className="mb-10">
              <img 
                src="https://suitenumero5.s3.us-east-1.amazonaws.com/img/logoorizontale.png" 
                alt="Suite Numero 5 Logo" 
                className="h-16 mb-6 mx-auto"
              />
              
              <p className="text-lg mb-4">
                {t('aboutIntro')}
              </p>
              
              <p className="mb-4">
                {t('aboutMission')}
              </p>
            </div>
            
            <div className="mb-10">
              <h2 className="heading-md mb-4">{t('ourStory')}</h2>
              <p className="mb-4">
                {t('storyContent1')}
              </p>
              <p className="mb-4">
                {t('storyContent2')}
              </p>
            </div>
            
            <div className="mb-10">
              <h2 className="heading-md mb-4">{t('ourValues')}</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">{t('authenticity')}</h3>
                  <p>{t('authenticityDesc')}</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">{t('quality')}</h3>
                  <p>{t('qualityDesc')}</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">{t('sustainability')}</h3>
                  <p>{t('sustainabilityDesc')}</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">{t('community')}</h3>
                  <p>{t('communityDesc')}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="heading-md mb-4">{t('ourTeam')}</h2>
              <p className="mb-6">
                {t('teamDesc')}
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold">Marco Rossi</h3>
                  <p className="text-gray-600">{t('founderCEO')}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold">Laura Bianchi</h3>
                  <p className="text-gray-600">{t('experienceDirector')}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold">Giovanni Verdi</h3>
                  <p className="text-gray-600">{t('headGuide')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
