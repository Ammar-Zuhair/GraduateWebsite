-- Supabase Schema Setup for Graduation Website

-- 1. Create Students Table
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    major TEXT NOT NULL CHECK (major IN ('it', 'arch')),
    bio_ar TEXT,
    profile_image TEXT,
    cover_image TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Wishes Table
CREATE TABLE public.wishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    relation TEXT,
    message TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Memories (Photos & Videos) Table
CREATE TABLE public.memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE, -- Null if general memory
    title_ar TEXT,
    title_en TEXT,
    url TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g., 'ceremony', 'defense', 'trips', 'labs'
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create News Table
CREATE TABLE public.news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_ar TEXT NOT NULL,
    content_en TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Sponsors Table
CREATE TABLE public.sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    logo_url TEXT NOT NULL,
    website_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Setup Row Level Security (RLS)

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- Students Policies
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.students FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
ON public.students FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile." 
ON public.students FOR UPDATE USING (auth.uid() = user_id);

-- Wishes Policies
CREATE POLICY "Wishes are viewable by everyone." 
ON public.wishes FOR SELECT USING (true);

CREATE POLICY "Anyone can insert a wish." 
ON public.wishes FOR INSERT WITH CHECK (true);

-- Memories Policies
CREATE POLICY "Memories are viewable by everyone." 
ON public.memories FOR SELECT USING (true);

CREATE POLICY "Students can insert their own memories." 
ON public.memories FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.students WHERE id = student_id));

CREATE POLICY "Admins can insert any memories."
ON public.memories FOR INSERT WITH CHECK (
  (auth.jwt() ->> 'email') = 'admin@university.edu'
  OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Students can delete their own memories." 
ON public.memories FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.students WHERE id = student_id));

CREATE POLICY "Admins can delete any memories."
ON public.memories FOR DELETE USING (
  (auth.jwt() ->> 'email') = 'admin@university.edu'
  OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- News Policies
CREATE POLICY "News are viewable by everyone." 
ON public.news FOR SELECT USING (true);

-- Sponsors Policies
CREATE POLICY "Sponsors are viewable by everyone." 
ON public.sponsors FOR SELECT USING (true);

-- 7. Storage Buckets (Run manually in Storage UI or via SQL if superuser)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('sponsors', 'sponsors', true);

-- 8. Create Visitors Table (For Unique Device Tracking)
CREATE TABLE public.visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert a visitor record" 
ON public.visitors FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can select visitors count" 
ON public.visitors FOR SELECT USING (true);

