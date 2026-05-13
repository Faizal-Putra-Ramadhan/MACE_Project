import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function uploadFile(bucket, path, file, contentType) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType, upsert: true });
  
  if (error) throw error;
  
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return urlData.publicUrl;
}
