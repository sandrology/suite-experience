
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash, Eye, EyeOff, Plus, Download } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import { Experience } from '../../types/experience';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from "@/hooks/use-toast";
import { 
  getExperiences,
  deleteExperience, 
  toggleExperienceStatus,
  exportExperiencesAsJson,
  DEFAULT_IMAGE,
  initializeSupabaseData
} from '../../services/experienceService';
import dataConfig from '../../config/dataConfig';

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Function to load experiences
  const loadExperiences = async () => {
    setLoading(true);
    try {
      // Initialize Supabase data if needed
      if (dataConfig.mode === 'supabase') {
        await initializeSupabaseData();
      }
      
      // Then load experiences
      const loadedExperiences = await getExperiences();
      setExperiences(loadedExperiences);
    } catch (error) {
      console.error('Error loading experiences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load experiences data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    loadExperiences();
    
    // Add event listener for experience updates
    const handleExperiencesUpdated = () => {
      console.log('Experiences updated event detected in Dashboard');
      loadExperiences();
    };
    
    window.addEventListener('experiencesUpdated', handleExperiencesUpdated);
    
    return () => {
      window.removeEventListener('experiencesUpdated', handleExperiencesUpdated);
    };
  }, []);

  const handleToggleExperienceStatus = async (id: string) => {
    try {
      const success = await toggleExperienceStatus(id);
      
      if (success) {
        toast({
          title: t('statusUpdated'),
          description: t('statusUpdatedDesc')
        });
        
        // Update the local state for immediate UI feedback
        setExperiences(prevExperiences =>
          prevExperiences.map(exp =>
            exp.id === id ? { ...exp, enabled: !exp.enabled } : exp
          )
        );
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update experience status',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      const success = await deleteExperience(id);
      
      if (success) {
        toast({
          title: t('experienceDeleted'),
          description: t('experienceDeletedDesc')
        });
        
        // Update the local state for immediate UI feedback
        setExperiences(prevExperiences => 
          prevExperiences.filter(exp => exp.id !== id)
        );
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the experience',
        variant: 'destructive'
      });
    }
  };

  const handleExportJsonRaw = async () => {
    try {
      const jsonData = await exportExperiencesAsJson();
      
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Experience.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export Successful',
        description: 'Experiences data exported successfully as Experience.json. Place this file in the public folder of your project for the next build.'
      });
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast({
        title: 'Error',
        description: 'Failed to export experiences data',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container-custom py-12">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="heading-lg">{t('manageExperiences')}</h1>
            <div className="flex space-x-3">
              <button
                onClick={handleExportJsonRaw}
                className="btn-secondary inline-flex items-center"
                title="Export as JSON"
              >
                <Download className="mr-2 h-4 w-4" />
                Export JSON
              </button>
              <Link to="/admin/create" className="btn-primary inline-flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                {t('createExperience')}
              </Link>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t('title')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t('location')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t('price')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t('status')}</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {experiences.length > 0 ? (
                    experiences.map((experience) => (
                      <tr key={experience.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <img 
                              src={experience.images && experience.images.length > 0 ? experience.images[0] : DEFAULT_IMAGE} 
                              alt={experience.translations[language].title} 
                              className="h-10 w-10 rounded-md object-cover mr-3"
                              onError={(e) => {
                                e.currentTarget.src = DEFAULT_IMAGE;
                              }}
                            />
                            <span className="font-medium">{experience.translations[language].title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600">{experience.location}</td>
                        <td className="px-4 py-4 text-gray-600">${experience.price}</td>
                        <td className="px-4 py-4">
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              experience.enabled 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {experience.enabled ? t('active') : t('inactive')}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleToggleExperienceStatus(experience.id)}
                              className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100"
                              title={experience.enabled ? t('disable') : t('enable')}
                            >
                              {experience.enabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            <Link
                              to={`/admin/edit/${experience.id}`}
                              className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50"
                              title={t('edit')}
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteExperience(experience.id)}
                              className="p-1.5 rounded-md text-red-600 hover:bg-red-50"
                              title={t('delete')}
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        {t('noExperiences')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Nota informativa su come funziona il sistema */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">Modalità dati: {dataConfig.mode === 'json' ? 'JSON File' : 'Supabase'}</h3>
            <p className="text-blue-700 text-sm">
              {dataConfig.mode === 'json' ? 
                'Le modifiche apportate qui sono temporanee. Per rendere permanenti le modifiche, esporta il file JSON e sostituiscilo al file Experience.json nella cartella public prima della prossima build.' :
                'Le modifiche vengono salvate direttamente nel database Supabase.'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
