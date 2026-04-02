import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://culkwdxavdeznltzeshq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1bGt3ZHhhdmRlem5sdHplc2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NDkwNjksImV4cCI6MjA5MDIyNTA2OX0.2UUBVRIRp4x7j-RaoB8XOrbBh3Eca5kHn4RlSymUmFs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getServerUrl = () => {
  const projectId = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
  return `https://${projectId}.supabase.co/functions/v1/make-server-e5956044`;
};
