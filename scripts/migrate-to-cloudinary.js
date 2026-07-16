import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load .env file
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ Cannot find .env file at:', envPath);
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const index = trimmed.indexOf('=');
    if (index !== -1) {
      const key = trimmed.substring(0, index).trim();
      const value = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
      env[key] = value;
    }
  });
  return env;
}

const env = loadEnv();

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
const cloudName = env.VITE_CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = env.CLOUDINARY_API_SECRET;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Supabase credentials missing in .env (VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

if (!cloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
  console.error('❌ Cloudinary API credentials missing in .env (VITE_CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET)');
  process.exit(1);
}

// Initialize Supabase Admin client using Service Role Key to bypass RLS policies
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

/**
 * Uploads a remote file to Cloudinary via Signed REST API
 */
async function uploadToCloudinary(remoteUrl, folder) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const stringToSign = `folder=${folder}&timestamp=${timestamp}${cloudinaryApiSecret}`;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    const formData = new FormData();
    formData.append('file', remoteUrl);
    formData.append('api_key', cloudinaryApiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('folder', folder);
    formData.append('signature', signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Cloudinary upload endpoint returned error status.');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error(`  ⚠️ Cloudinary Upload Failed for URL: ${remoteUrl}`);
    console.error(`  Error: ${error.message}`);
    return null;
  }
}

/**
 * Checks if a URL is stored in Supabase Storage
 */
function isSupabaseStorageUrl(url) {
  if (!url) return false;
  return url.includes('supabase.co/storage') || url.includes('/storage/v1/object/public/');
}

async function migrate() {
  console.log('🚀 Starting Media Migration to Cloudinary...\n');

  // ==========================================
  // 1. Migrate Cohort Logo (HomePage hardcoded)
  // ==========================================
  const logoSupabaseUrl = 'https://prsxwxpsuhkigtrntaqn.supabase.co/storage/v1/object/public/gallery/WhatsApp%20Image%202026-07-07%20at%2010.25.23%20PM.jpeg';
  console.log('-----------------------------------------');
  console.log('📦 Migrating Cohort Logo (HomePage hardcoded)...');
  const migratedLogoUrl = await uploadToCloudinary(logoSupabaseUrl, 'general');
  if (migratedLogoUrl) {
    console.log(`✅ Cohort Logo migrated to: ${migratedLogoUrl}`);
  } else {
    console.error('❌ Failed to migrate Cohort Logo');
  }

  // ==========================================
  // 2. Migrate Students Table
  // ==========================================
  console.log('\n-----------------------------------------');
  console.log('📦 Fetching students...');
  const { data: students, error: studentsErr } = await supabase
    .from('students')
    .select('id, name_ar, profile_image, cover_image');

  if (studentsErr) {
    console.error('❌ Error fetching students:', studentsErr.message);
  } else {
    console.log(`Found ${students.length} students.`);
    for (const student of students) {
      let updatedProfile = null;
      let updatedCover = null;

      if (isSupabaseStorageUrl(student.profile_image)) {
        console.log(`  Uploading profile image for: ${student.name_ar}...`);
        updatedProfile = await uploadToCloudinary(student.profile_image, 'profiles');
      }

      if (isSupabaseStorageUrl(student.cover_image)) {
        console.log(`  Uploading cover image for: ${student.name_ar}...`);
        updatedCover = await uploadToCloudinary(student.cover_image, 'covers');
      }

      if (updatedProfile || updatedCover) {
        const updateData = {};
        if (updatedProfile) updateData.profile_image = updatedProfile;
        if (updatedCover) updateData.cover_image = updatedCover;

        const { error: updateErr } = await supabase
          .from('students')
          .update(updateData)
          .eq('id', student.id);

        if (updateErr) {
          console.error(`  ❌ Failed to update DB for student ${student.name_ar}:`, updateErr.message);
        } else {
          console.log(`  ✅ Student ${student.name_ar} profile updated.`);
        }
      }
    }
  }

  // ==========================================
  // 3. Migrate Memories Table
  // ==========================================
  console.log('\n-----------------------------------------');
  console.log('📦 Fetching memories...');
  const { data: memories, error: memoriesErr } = await supabase
    .from('memories')
    .select('id, title_ar, url');

  if (memoriesErr) {
    console.error('❌ Error fetching memories:', memoriesErr.message);
  } else {
    console.log(`Found ${memories.length} memories.`);
    for (const memory of memories) {
      if (isSupabaseStorageUrl(memory.url)) {
        console.log(`  Uploading memory: ${memory.title_ar || memory.id}...`);
        const updatedUrl = await uploadToCloudinary(memory.url, 'memories');

        if (updatedUrl) {
          const { error: updateErr } = await supabase
            .from('memories')
            .update({ url: updatedUrl })
            .eq('id', memory.id);

          if (updateErr) {
            console.error(`  ❌ Failed to update DB for memory ${memory.id}:`, updateErr.message);
          } else {
            console.log(`  ✅ Memory ${memory.id} URL updated.`);
          }
        }
      }
    }
  }

  // ==========================================
  // 4. Migrate Sponsors Table
  // ==========================================
  console.log('\n-----------------------------------------');
  console.log('📦 Fetching sponsors...');
  const { data: sponsors, error: sponsorsErr } = await supabase
    .from('sponsors')
    .select('id, name_ar, logo_url');

  if (sponsorsErr) {
    console.error('❌ Error fetching sponsors:', sponsorsErr.message);
  } else {
    console.log(`Found ${sponsors.length} sponsors.`);
    for (const sponsor of sponsors) {
      if (isSupabaseStorageUrl(sponsor.logo_url)) {
        console.log(`  Uploading logo for sponsor: ${sponsor.name_ar}...`);
        const updatedLogo = await uploadToCloudinary(sponsor.logo_url, 'sponsors');

        if (updatedLogo) {
          const { error: updateErr } = await supabase
            .from('sponsors')
            .update({ logo_url: updatedLogo })
            .eq('id', sponsor.id);

          if (updateErr) {
            console.error(`  ❌ Failed to update DB for sponsor ${sponsor.name_ar}:`, updateErr.message);
          } else {
            console.log(`  ✅ Sponsor ${sponsor.name_ar} updated.`);
          }
        }
      }
    }
  }

  // ==========================================
  // 5. Migrate Doctors Table
  // ==========================================
  console.log('\n-----------------------------------------');
  console.log('📦 Fetching doctors...');
  const { data: doctors, error: doctorsErr } = await supabase
    .from('doctors')
    .select('id, name_ar, image_url');

  if (doctorsErr) {
    console.error('❌ Error fetching doctors:', doctorsErr.message);
  } else {
    console.log(`Found ${doctors.length} doctors.`);
    for (const doctor of doctors) {
      if (isSupabaseStorageUrl(doctor.image_url)) {
        console.log(`  Uploading photo for doctor: ${doctor.name_ar}...`);
        const updatedPhoto = await uploadToCloudinary(doctor.image_url, 'doctors');

        if (updatedPhoto) {
          const { error: updateErr } = await supabase
            .from('doctors')
            .update({ image_url: updatedPhoto })
            .eq('id', doctor.id);

          if (updateErr) {
            console.error(`  ❌ Failed to update DB for doctor ${doctor.name_ar}:`, updateErr.message);
          } else {
            console.log(`  ✅ Doctor ${doctor.name_ar} updated.`);
          }
        }
      }
    }
  }

  console.log('\n=========================================');
  console.log('🎉 Migration Finished successfully!');
  if (migratedLogoUrl) {
    console.log(`\n📌 NEW COHORT LOGO CLOUDINARY URL:\n${migratedLogoUrl}\n`);
  }
  console.log('=========================================');
}

migrate().catch(err => {
  console.error('❌ Migration crashed:', err);
});
