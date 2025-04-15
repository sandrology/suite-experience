import { Experience } from '../types/experience';
import { experiencesData as initialData } from '../data/experiencesData';
import dataConfig from '../config/dataConfig';
import { 
  supabase,
  fetchExperiences as fetchSupabaseExperiences,
  insertExperience,
  updateExperienceById,
  deleteExperienceById,
  importExperiences as importSupabaseExperiences,
  initializeSchema
} from './supabaseService';

// Default image for experiences
export const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=500";

// Storage key for admin temporary data
const ADMIN_STORAGE_KEY = 'admin_experiences_data';

// In-memory storage to cache experiences
let experiencesCache: Experience[] = [];

// Utility function to ensure numeric values
const ensureNumericValues = (experiences: any[]): Experience[] => {
  return experiences.map(exp => ({
    ...exp,
    price: typeof exp.price === 'string' ? parseFloat(exp.price) || 0 : Number(exp.price),
    maxPeople: typeof exp.maxPeople === 'string' ? parseInt(exp.maxPeople) || 0 : Number(exp.maxPeople),
    rating: typeof exp.rating === 'string' ? parseFloat(exp.rating) || 0 : Number(exp.rating),
    reviews: Array.isArray(exp.reviews) ? exp.reviews : []
  })) as Experience[];
};

// Load data from JSON file
const loadJsonData = async (): Promise<Experience[]> => {
  try {
    const response = await fetch(dataConfig.jsonFilePath);
    if (!response.ok) {
      console.error('Error loading JSON file:', response.status);
      return ensureNumericValues([...initialData]);
    }
    
    const data = await response.json();
    return ensureNumericValues(data);
  } catch (error) {
    console.error('Error parsing JSON file:', error);
    return ensureNumericValues([...initialData]);
  }
};

// Load data from localStorage (admin temporary storage)
const loadFromLocalStorage = (): Experience[] | null => {
  try {
    const data = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (data) {
      return ensureNumericValues(JSON.parse(data));
    }
    return null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// Save data to localStorage (admin temporary storage)
const saveToLocalStorage = (experiences: Experience[]): void => {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(experiences));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Get experiences from appropriate source
export const getExperiences = async (): Promise<Experience[]> => {
  if (dataConfig.mode === 'supabase') {
    try {
      await initializeSchema();
      const supabaseExperiences = await fetchSupabaseExperiences();
      
      if (supabaseExperiences.length > 0) {
        experiencesCache = ensureNumericValues(supabaseExperiences);
        return experiencesCache;
      } else {
        const jsonData = await loadJsonData();
        await importSupabaseExperiences(jsonData);
        experiencesCache = jsonData;
        return jsonData;
      }
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
      const jsonData = await loadJsonData();
      experiencesCache = jsonData;
      return jsonData;
    }
  }
  
  // If using JSON mode, first try localStorage for admin
  const localData = loadFromLocalStorage();
  if (localData) {
    experiencesCache = localData;
    return localData;
  }
  
  // If no localStorage data, load from JSON file
  const jsonData = await loadJsonData();
  experiencesCache = jsonData;
  return jsonData;
};

// For backward compatibility
export const getExperiencesSync = (): Experience[] => {
  if (experiencesCache.length > 0) {
    return [...experiencesCache];
  }
  
  getExperiences().then(() => {
    window.dispatchEvent(new Event('experiencesUpdated'));
  });
  
  return [];
};

// Save experiences
export const saveExperiences = async (experiences: Experience[]): Promise<boolean> => {
  try {
    const validatedExperiences = ensureNumericValues(experiences);
    experiencesCache = [...validatedExperiences];
    
    if (dataConfig.mode === 'supabase') {
      await initializeSchema();
      for (const experience of validatedExperiences) {
        await updateExperienceById(experience);
      }
    } else {
      // In JSON mode, save to localStorage
      saveToLocalStorage(validatedExperiences);
    }
    
    window.dispatchEvent(new Event('experiencesUpdated'));
    return true;
  } catch (error) {
    console.error('Error saving experiences:', error);
    return false;
  }
};

// Add a new experience
export const addExperience = async (experience: Experience): Promise<boolean> => {
  try {
    const formattedExperience = ensureNumericValues([experience])[0];
    const experiences = [...experiencesCache];
    experiences.push(formattedExperience);
    
    if (dataConfig.mode === 'supabase') {
      await initializeSchema();
      await insertExperience(formattedExperience);
    } else {
      // In JSON mode, save to localStorage
      saveToLocalStorage(experiences);
    }
    
    experiencesCache = experiences;
    window.dispatchEvent(new Event('experiencesUpdated'));
    return true;
  } catch (error) {
    console.error('Error adding experience:', error);
    return false;
  }
};

// Update an existing experience
export const updateExperience = async (experience: Experience): Promise<boolean> => {
  try {
    const formattedExperience = ensureNumericValues([experience])[0];
    const experiences = [...experiencesCache];
    const index = experiences.findIndex(exp => exp.id === formattedExperience.id);
    
    if (index !== -1) {
      experiences[index] = formattedExperience;
      
      if (dataConfig.mode === 'supabase') {
        await initializeSchema();
        await updateExperienceById(formattedExperience);
      } else {
        // In JSON mode, save to localStorage
        saveToLocalStorage(experiences);
      }
      
      experiencesCache = experiences;
      window.dispatchEvent(new Event('experiencesUpdated'));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating experience:', error);
    return false;
  }
};

// Delete an experience
export const deleteExperience = async (id: string): Promise<boolean> => {
  try {
    const experiences = [...experiencesCache];
    const filteredExperiences = experiences.filter(exp => exp.id !== id);
    
    if (filteredExperiences.length < experiences.length) {
      if (dataConfig.mode === 'supabase') {
        await initializeSchema();
        await deleteExperienceById(id);
      } else {
        // In JSON mode, save to localStorage
        saveToLocalStorage(filteredExperiences);
      }
      
      experiencesCache = filteredExperiences;
      window.dispatchEvent(new Event('experiencesUpdated'));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting experience:', error);
    return false;
  }
};

// Toggle an experience's status
export const toggleExperienceStatus = async (id: string): Promise<boolean> => {
  try {
    const experiences = [...experiencesCache];
    const index = experiences.findIndex(exp => exp.id === id);
    
    if (index !== -1) {
      const updatedExperience = {
        ...experiences[index],
        enabled: !experiences[index].enabled
      };
      
      experiences[index] = updatedExperience;
      
      if (dataConfig.mode === 'supabase') {
        await initializeSchema();
        await updateExperienceById(updatedExperience);
      } else {
        // In JSON mode, save to localStorage
        saveToLocalStorage(experiences);
      }
      
      experiencesCache = experiences;
      window.dispatchEvent(new Event('experiencesUpdated'));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error toggling experience status:', error);
    return false;
  }
};

// Get an experience by ID
export const getExperienceById = async (id: string): Promise<Experience | undefined> => {
  try {
    let cachedExperience = experiencesCache.find(exp => exp.id === id);
    
    if (cachedExperience) {
      return cachedExperience;
    }
    
    await getExperiences();
    return experiencesCache.find(exp => exp.id === id);
  } catch (error) {
    console.error(`Error fetching experience with ID ${id}:`, error);
    return undefined;
  }
};

// Synchronous version for backward compatibility
export const getExperienceByIdSync = (id: string): Experience | undefined => {
  return experiencesCache.find(exp => exp.id === id);
};

// Export experiences as JSON string
export const exportExperiencesAsJson = async (): Promise<string> => {
  let experiences: Experience[];
  
  if (experiencesCache.length === 0) {
    experiences = await getExperiences();
  } else {
    experiences = [...experiencesCache];
  }
  
  // Clear localStorage after export
  if (dataConfig.mode === 'json') {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }
  
  return JSON.stringify(experiences, null, 2);
};

// Initialize Supabase data if needed
export const initializeSupabaseData = async (): Promise<void> => {
  if (dataConfig.mode === 'supabase') {
    try {
      await initializeSchema();
      const supabaseExperiences = await fetchSupabaseExperiences();
      
      if (supabaseExperiences.length === 0) {
        const jsonData = await loadJsonData();
        
        if (jsonData.length > 0) {
          console.log('Initializing Supabase with JSON data...');
          await importSupabaseExperiences(jsonData);
        }
      }
    } catch (error) {
      console.error('Error initializing Supabase data:', error);
    }
  }
};

// Prepare content for display
export const formatContent = (content: string): string => {
  if (!content) return '';
  
  if (content.includes('<ul>') || content.includes('<ol>')) {
    return content;
  }
  
  const lines = content.split('\n');
  let formattedContent = '';
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!inList) {
        formattedContent += '<ul>';
        inList = true;
      }
      
      line = line.replace(/^[*-]\s/, '');
      formattedContent += `<li>${line}</li>`;
    } else if (line.match(/^\d+\.\s/) || line.match(/^\d+\)\s/)) {
      if (!inList) {
        formattedContent += '<ol>';
        inList = true;
      }
      
      line = line.replace(/^\d+[\.\)]\s/, '');
      formattedContent += `<li>${line}</li>`;
    } else {
      if (inList) {
        formattedContent += inList ? '</ul>' : '</ol>';
        inList = false;
      }
      
      if (line) {
        formattedContent += line + '<br>';
      } else {
        formattedContent += '<br>';
      }
    }
  }
  
  if (inList) {
    formattedContent += '</ul>';
  }
  
  return formattedContent;
};