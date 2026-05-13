import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_VITE_SUPABASE_ANON_KEY; // Oops typo in user request, I'll use VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, import.meta.env.VITE_SUPABASE_ANON_KEY);

export async function uploadDokumen(file, bucket = 'dokumen-pendaftaran') {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);
  
  if (error) throw error;
  
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  
  return urlData.publicUrl;
}
