
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import ExperienceForm from '../../components/admin/ExperienceForm';
import { Experience } from '../../types/experience';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from "@/hooks/use-toast";
import { getExperienceById, updateExperience, DEFAULT_IMAGE } from '../../services/experienceService';

const EditExperience = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadExperience = async () => {
      if (id) {
        try {
          const foundExperience = await getExperienceById(id);
          
          if (!foundExperience) {
            toast({
              title: t('experienceNotFound'),
              description: t('experienceNotFoundDesc'),
              variant: "destructive"
            });
            navigate('/admin');
          } else {
            setExperience(foundExperience);
          }
        } catch (error) {
          console.error('Error loading experience:', error);
          toast({
            title: 'Error',
            description: 'Failed to load experience',
            variant: "destructive"
          });
          navigate('/admin');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadExperience();
  }, [id, navigate, toast, t]);

  const handleUpdateExperience = (experienceData: Partial<Experience>) => {
    if (!experience || !id) return;
    
    // Ensure numeric values are properly converted
    const updatedExperience: Experience = {
      ...experience,
      ...experienceData,
      id: id, // Ensure ID remains the same
      price: typeof experienceData.price === 'string' ? parseFloat(experienceData.price) || 0 : Number(experienceData.price || experience.price),
      maxPeople: typeof experienceData.maxPeople === 'string' ? parseInt(experienceData.maxPeople) || 0 : Number(experienceData.maxPeople || experience.maxPeople),
      rating: typeof experienceData.rating === 'string' ? parseFloat(experienceData.rating) || 0 : Number(experienceData.rating || experience.rating),
      images: experienceData.images?.length ? experienceData.images : [DEFAULT_IMAGE],
    };
    
    // Update in database
    updateExperience(updatedExperience)
      .then(success => {
        if (success) {
          toast({
            title: t('experienceUpdated'),
            description: t('experienceUpdatedDesc'),
          });
          
          // Redirect to admin dashboard
          navigate('/admin');
        } else {
          throw new Error('Failed to update experience');
        }
      })
      .catch(error => {
        console.error('Error updating experience:', error);
        toast({
          title: 'Error',
          description: 'Failed to update experience',
          variant: 'destructive'
        });
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container-custom py-12 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4">{t('loading')}</p>
          </div>
        </main>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container-custom py-12 flex justify-center items-center">
          <div className="text-center">
            <p className="text-xl text-red-500">{t('experienceNotFound')}</p>
            <button 
              className="mt-4 btn-primary"
              onClick={() => navigate('/admin')}
            >
              {t('backToAdmin')}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container-custom py-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="heading-lg mb-6">{t('editExperience')}</h1>
          <ExperienceForm 
            experience={experience} 
            onSubmit={handleUpdateExperience} 
          />
        </div>
      </main>
    </div>
  );
};

export default EditExperience;
