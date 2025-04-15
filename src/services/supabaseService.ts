
import { createClient } from '@supabase/supabase-js';
import { Experience } from '../types/experience';

// Initialize Supabase client with provided credentials
// These values can be overridden at build time by environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kryuzmimyqqthpbxwnkn.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeXV6bWlteXFxdGhwYnh3bmtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDM3NDgxNiwiZXhwIjoyMDU5OTUwODE2fQ.gOR8swThSI--ZnymXiMhB5NIizLhtl3b8kJ8_SNB2ZY';

// Console info for configuration status
if (import.meta.env.DEV) {
  console.info('Supabase configuration:', { 
    usingEnvVars: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
    url: supabaseUrl
  });
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Supabase database schema if needed
export const initializeSchema = async (): Promise<boolean> => {
  try {
    // Check if experiences table exists
    const { error: checkError } = await supabase
      .from('experiences')
      .select('id')
      .limit(1);
    
    // If the table doesn't exist, create it
    if (checkError && checkError.code === '42P01') { // SQL code for "relation does not exist"
      console.log('Creating experiences table...');
      
      // Create the experiences table using SQL
      const { error: createError } = await supabase.rpc('create_experiences_table');
      
      if (createError) {
        console.error('Error creating experiences table with RPC:', createError);
        
        // Fallback: Create the table using raw SQL
        const { error: sqlError } = await supabase.rpc('execute_sql', {
          sql_query: `
            CREATE TABLE IF NOT EXISTS public.experiences (
              id TEXT PRIMARY KEY,
              enabled BOOLEAN DEFAULT TRUE,
              images TEXT[] DEFAULT ARRAY[]::TEXT[],
              translations JSONB NOT NULL,
              price NUMERIC NOT NULL,
              duration TEXT NOT NULL,
              location TEXT NOT NULL,
              rating NUMERIC DEFAULT 5.0,
              "maxPeople" INTEGER DEFAULT 10,
              reviews JSONB DEFAULT '[]'::JSONB
            );
          `
        });
        
        if (sqlError) {
          console.error('Error creating experiences table with SQL:', sqlError);
          return false;
        }
      }
      
      console.log('Experiences table created successfully');
      return true;
    }
    
    // Table already exists
    return true;
  } catch (error) {
    console.error('Error initializing schema:', error);
    return false;
  }
};

// Experiences table operations
export const fetchExperiences = async (): Promise<Experience[]> => {
  try {
    // Try to initialize schema first
    await initializeSchema();
    
    const { data, error } = await supabase
      .from('experiences')
      .select('*');
    
    if (error) {
      console.error('Error fetching experiences:', error);
      return [];
    }
    
    // Make sure numeric fields are converted properly
    const typedData = data?.map(item => ({
      ...item,
      price: typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price),
      maxPeople: typeof item.maxPeople === 'string' ? parseInt(item.maxPeople) : Number(item.maxPeople),
      rating: typeof item.rating === 'string' ? parseFloat(item.rating) : Number(item.rating),
      reviews: Array.isArray(item.reviews) ? item.reviews : []
    })) as Experience[];
    
    return typedData || [];
  } catch (error) {
    console.error('Unexpected error fetching experiences:', error);
    return [];
  }
};

export const insertExperience = async (experience: Experience): Promise<boolean> => {
  try {
    // Ensure all numeric fields are properly typed before inserting
    const preparedExperience = {
      ...experience,
      price: Number(experience.price),
      maxPeople: Number(experience.maxPeople),
      rating: Number(experience.rating)
    };

    // Initialize schema if needed
    await initializeSchema();

    const { error } = await supabase
      .from('experiences')
      .insert([preparedExperience]);
    
    if (error) {
      console.error('Error inserting experience:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error inserting experience:', error);
    return false;
  }
};

export const updateExperienceById = async (experience: Experience): Promise<boolean> => {
  try {
    // Ensure all numeric fields are properly typed before updating
    const preparedExperience = {
      ...experience,
      price: Number(experience.price),
      maxPeople: Number(experience.maxPeople),
      rating: Number(experience.rating)
    };

    // Initialize schema if needed
    await initializeSchema();

    const { error } = await supabase
      .from('experiences')
      .update(preparedExperience)
      .eq('id', experience.id);
    
    if (error) {
      console.error('Error updating experience:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error updating experience:', error);
    return false;
  }
};

export const deleteExperienceById = async (id: string): Promise<boolean> => {
  try {
    // Initialize schema if needed
    await initializeSchema();
    
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting experience:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error deleting experience:', error);
    return false;
  }
};

// Import multiple experiences at once
export const importExperiences = async (experiences: Experience[]): Promise<boolean> => {
  try {
    // Initialize schema if needed
    await initializeSchema();
    
    // Ensure data types are correct before inserting
    const validatedExperiences = experiences.map(exp => ({
      ...exp,
      price: typeof exp.price === 'string' ? parseFloat(exp.price) : Number(exp.price),
      maxPeople: typeof exp.maxPeople === 'string' ? parseInt(exp.maxPeople) : Number(exp.maxPeople),
      rating: typeof exp.rating === 'string' ? parseFloat(exp.rating) : Number(exp.rating),
      reviews: Array.isArray(exp.reviews) ? exp.reviews : []
    }));
    
    // Using upsert to replace if exists or insert if not
    const { error } = await supabase
      .from('experiences')
      .upsert(validatedExperiences, { onConflict: 'id' });
    
    if (error) {
      console.error('Error importing experiences:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error importing experiences:', error);
    return false;
  }
};
