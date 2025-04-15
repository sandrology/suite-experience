import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Experience } from '../../data/mockExperiences';
import { useLanguage } from '../../context/LanguageContext';
import { DEFAULT_IMAGE } from '../../services/experienceService';

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const { language, t } = useLanguage();
  
  // Extract translated content based on current language
  const translation = experience.translations[language as keyof typeof experience.translations];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg h-full flex flex-col">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={experience.images && experience.images.length > 0 ? experience.images[0] : DEFAULT_IMAGE} 
          alt={translation.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_IMAGE;
          }}
        />
        <div className="absolute top-4 right-4">
          <div className="flex items-center bg-white bg-opacity-90 rounded-full px-2 py-1">
            <Star className="h-4 w-4 text-accent fill-accent" />
            <span className="ml-1 text-sm font-medium">{experience.rating}</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20 opacity-70"></div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="heading-sm mb-2 line-clamp-2">{translation.title}</h3>
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <span>{experience.location}</span>
            <span className="mx-2">•</span>
            <span>{experience.duration}</span>
          </div>
          <p className="text-gray-600 mb-4 line-clamp-2">{translation.description}</p>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <span className="text-primary font-bold text-xl">€{experience.price}</span>
          <Link 
            to={`/experience/${experience.id}`} 
            className="btn-primary"
            onClick={() => window.scrollTo(0, 0)}
          >
            {t('viewMore')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;