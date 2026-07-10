import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your actual Supabase Project URL and Anon Key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const createThumbnail = (file, maxDim = 900) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          } else {
            resolve(null);
          }
        }, 'image/jpeg', 0.85); // 85% quality is the sweet spot for Retina displays (zero visible noise)
      };
      img.onerror = () => resolve(null);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};

export const uploadImage = async (file, folder = 'general') => {
  if (!file) return null;
  const fileExt = file.name.split('.').pop() || 'jpg';
  const rawFileName = Math.random().toString(36).substring(2, 15) + '-' + Date.now();
  const fileName = `${rawFileName}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  // 1. Upload original image
  const { error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  // 2. Generate and upload thumbnail for memories
  if (folder === 'memories') {
    try {
      const thumbFile = await createThumbnail(file, 900);
      if (thumbFile) {
        const thumbPath = `${folder}/${rawFileName}_thumb.${fileExt}`;
        await supabase.storage
          .from('gallery')
          .upload(thumbPath, thumbFile);
      }
    } catch (err) {
      console.warn("Failed to generate/upload thumbnail:", err);
    }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('gallery')
    .getPublicUrl(filePath);

  return publicUrl;
};

