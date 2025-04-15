
import React from 'react';
import { Star, Clock, Users, MapPin } from 'lucide-react';
import { Experience } from '../../data/mockExperiences';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

interface ExperienceDetailProps {
  experience: Experience;
  formattedContent?: string;
}

const ExperienceDetail: React.FC<ExperienceDetailProps> = ({ experience, formattedContent }) => {
  const { language, t } = useLanguage();
  
  // Extract translated content based on current language
  const translation = experience.translations[language as keyof typeof experience.translations];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {experience.images.map((image, index) => (
          <div 
            key={index} 
            className={`${index === 0 ? 'col-span-1 md:col-span-2' : 'col-span-1'} h-64 md:h-80 rounded-lg overflow-hidden`}
          >
            <img 
              src={image} 
              alt={`${translation.title} - image ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      {/* Content */}
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-6">
          <div>
            <h1 className="heading-lg mb-2">{translation.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{experience.location}</span>
              <div className="ml-4 flex items-center">
                <Star className="h-4 w-4 text-accent fill-accent" />
                <span className="ml-1">{experience.rating} ({experience.reviews?.length || 0} reviews)</span>
              </div>
            </div>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="text-3xl font-bold text-primary mb-2">€{experience.price} <span className="text-base font-normal text-gray-600"> </span></div>
            {/* Comment out Book Now button
            <button className="btn-primary w-full">
              {t('bookNow')}
            </button>
            */}
            <Link to="/#home" className="btn-secondary w-full inline-block text-center">
              {t('Back to Experiences')}
            </Link>
          </div>
        </div>
        
        {/* Details */}
        <div className="flex flex-wrap gap-4 mb-8 border-y py-6">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-600" />
            <div>
              <div className="text-sm text-gray-500">Duration</div>
              <div className="font-medium">{experience.duration}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-gray-600" />
            <div>
              <div className="text-sm text-gray-500">Max Group Size</div>
              <div className="font-medium">{experience.maxPeople} people</div>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-8">
          <h2 className="heading-sm mb-4">{t('description')}</h2>
          <p className="text-gray-600 mb-6">{translation.description}</p>
        </div>
        
        {/* Content */}
        <div>
          <h2 className="heading-sm mb-4">{t('content')}</h2>
          <div 
            className="prose max-w-none text-gray-600"
            dangerouslySetInnerHTML={{ __html: formattedContent || translation.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;
