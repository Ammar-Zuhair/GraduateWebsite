import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [memories, setMemories] = useState([]); // Will hold both photos and videos
  const [news, setNews] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [wishes, setWishes] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [visitorCount, setVisitorCount] = useState(1520); // Default placeholder base
  const [totalWishesCount, setTotalWishesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        { data: studentsData },
        { data: wishesData },
        { data: memoriesData },
        { data: newsData },
        { data: sponsorsData }
      ] = await Promise.all([
        supabase.from('students').select('*').order('created_at', { ascending: false }),
        supabase.from('wishes').select('*').order('created_at', { ascending: false }),
        supabase.from('memories').select('*').order('created_at', { ascending: false }),
        supabase.from('news').select('*').order('event_date', { ascending: true }),
        supabase.from('sponsors').select('*').order('created_at', { ascending: false })
      ]);

      if (studentsData) setStudents(studentsData);
      if (wishesData) setWishes(wishesData);
      if (memoriesData) setMemories(memoriesData);
      if (newsData) setNews(newsData);
      if (sponsorsData) setSponsors(sponsorsData);

      // Fetch doctors separately so it won't crash if table isn't created yet
      try {
        const { data: doctorsData, error: doctorsError } = await supabase
          .from('doctors')
          .select('*')
          .order('created_at', { ascending: true });
        if (!doctorsError && doctorsData) {
          setDoctors(doctorsData);
        }
      } catch (e) {
        console.warn("Could not load doctors from Supabase", e);
      }

      // Fetch total wishes count via Security Definer RPC (bypasses RLS SELECT restrictions for guest users)
      try {
        const { data: rpcCount, error: rpcError } = await supabase.rpc('get_total_wishes_count');
        if (!rpcError && rpcCount !== null) {
          setTotalWishesCount(Number(rpcCount));
        } else {
          setTotalWishesCount(wishesData ? wishesData.length : 0);
        }
      } catch (e) {
        console.warn("get_total_wishes_count RPC failed:", e);
        setTotalWishesCount(wishesData ? wishesData.length : 0);
      }
    } catch (error) {
      console.error("Error fetching data from Supabase:", error);
    } finally {
      setLoading(false);
    }
  };

  const trackVisitor = async () => {
    try {
      let devId = localStorage.getItem('grad_visitor_device_id');
      if (!devId) {
        // Safe cross-browser UUID-like string
        devId = (crypto && crypto.randomUUID) 
          ? crypto.randomUUID() 
          : Math.random().toString(36).substring(2, 15) + '-' + Date.now().toString(36);
        localStorage.setItem('grad_visitor_device_id', devId);
        
        // Attempt insert, fail silently if table doesn't exist
        await supabase.from('visitors').insert([{ device_id: devId }]);
      }
      
      // Get unique visitor count
      const { count, error } = await supabase
        .from('visitors')
        .select('*', { count: 'exact', head: true });
        
      if (!error && count !== null) {
        setVisitorCount(count + 1520); // Add default base offset for aesthetic scaling
      }
    } catch (e) {
      console.warn("Visitor tracking table not ready yet, using placeholder count.");
    }
  };

  useEffect(() => {
    fetchAllData();
    trackVisitor();
    
    // Optional: Realtime subscriptions can be added here if needed
  }, []);

  // Compute stats
  const stats = {
    students: students.filter(s => s.status === 'approved' || s.is_approved !== false).length,
    males: 0, // Placeholder
    females: 0, // Placeholder
    projects: 0, // Placeholder
    photos: memories.filter(m => m.media_type === 'image').length,
    videos: memories.filter(m => m.media_type === 'video').length,
    wishes: totalWishesCount,
    visitors: visitorCount,
    depts: 2
  };

  // --- ACTIONS ---

  const addWish = async (wishData) => {
    const { error } = await supabase.from('wishes').insert([
      {
        student_id: wishData.studentId,
        author_name: wishData.author,
        relation: wishData.relation,
        message: wishData.message,
        is_anonymous: wishData.anonymous,
        status: 'approved'
      }
    ]);
    
    if (!error) {
      setTotalWishesCount(prev => prev + 1);
    }
    return { success: !error, error };
  };

  const deleteWish = async (id) => {
    const { data, error } = await supabase.from('wishes').delete().eq('id', id).select();
    if (!error && data && data.length > 0) {
      setWishes(prev => prev.filter(w => w.id !== id));
      setTotalWishesCount(prev => Math.max(0, prev - 1));
      return { success: true };
    }
    return { success: false, error: error?.message || 'RLS Policy Blocked Deletion' };
  };

  const deleteStudent = async (id) => {
    const { data, error } = await supabase.from('students').delete().eq('id', id).select();
    if (!error && data && data.length > 0) {
      setStudents(prev => prev.filter(s => s.id !== id));
      return { success: true };
    }
    return { success: false, error: error?.message || 'RLS Policy Blocked Deletion' };
  };

  const updateStudentStatus = async (id, newStatus) => {
    const { data, error } = await supabase
      .from('students')
      .update({ status: newStatus })
      .eq('id', id)
      .select();
      
    if (!error && data && data.length > 0) {
      setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
      return { success: true };
    }
    return { success: false, error: error || new Error('RLS Policy Blocked Update') };
  };

  const updateWishStatus = async (id, newStatus) => {
    const { data, error } = await supabase
      .from('wishes')
      .update({ status: newStatus })
      .eq('id', id)
      .select();
      
    if (!error && data && data.length > 0) {
      setWishes(prev => prev.map(w => w.id === id ? { ...w, status: newStatus } : w));
      return { success: true };
    }
    return { success: false, error: error || new Error('RLS Policy Blocked Update') };
  };

  const updateStudent = async (id, updatedData) => {
    const { data, error } = await supabase
      .from('students')
      .update({
        name_ar: updatedData.name_ar,
        name_en: updatedData.name_ar, // keep synced
        major: updatedData.major, // Update major department
        bio_ar: updatedData.bio_ar,
        bio_en: updatedData.bio_ar,
        profile_image: updatedData.profile_image,
        cover_image: updatedData.cover_image
      })
      .eq('id', id)
      .select();
      
    if (!error && data && data.length > 0) {
      setStudents(prev => prev.map(s => s.id === id ? data[0] : s));
    }
    return { success: !error && data && data.length > 0, error: error ? error.message : null };
  };

  const addMemory = async (memoryData) => {
    const { data, error } = await supabase.from('memories').insert([
      {
        student_id: memoryData.student_id || null,
        title_ar: memoryData.title_ar || memoryData.title || '',
        title_en: memoryData.title_en || memoryData.title || '',
        url: memoryData.url || memoryData.src || '',
        category: memoryData.category || 'ceremony',
        media_type: memoryData.media_type || memoryData.mediaType || 'image',
        cover_url: memoryData.cover_url || null
      }
    ]).select();
    
    if (!error && data && data.length > 0) {
      setMemories(prev => [data[0], ...prev]);
      return { success: true, data: data[0] };
    }
    return { success: false, error: error?.message || 'RLS Policy Blocked Insertion/Reading' };
  };

  const updateMemoryLikes = async (id, newLikes) => {
    const { error } = await supabase.from('memories').update({ likes: newLikes }).eq('id', id);
    if (!error) {
      setMemories(prev => prev.map(m => m.id === id ? { ...m, likes: newLikes } : m));
    }
  };

  const deleteMemory = async (id) => {
    const { data, error } = await supabase.from('memories').delete().eq('id', id).select();
    if (!error && data && data.length > 0) {
      setMemories(prev => prev.filter(m => m.id !== id));
      return { success: true };
    }
    return { success: false, error: error?.message || 'RLS Policy Blocked Deletion' };
  };

  const updateMemory = async (id, memoryData) => {
    const { data, error } = await supabase
      .from('memories')
      .update({
        title_ar: memoryData.title_ar,
        title_en: memoryData.title_en,
        url: memoryData.url,
        category: memoryData.category,
        media_type: memoryData.media_type,
        cover_url: memoryData.cover_url || null
      })
      .eq('id', id)
      .select();

    if (!error && data && data.length > 0) {
      setMemories(prev => prev.map(m => m.id === id ? data[0] : m));
      return { success: true };
    }
    return { success: false, error: error?.message };
  };

  const addNewsItem = async (newsData) => {
    const { data, error } = await supabase.from('news').insert([
      {
        title_ar: newsData.title,
        title_en: newsData.title,
        content_ar: newsData.content,
        content_en: newsData.content,
        event_date: newsData.date || null,
        category: newsData.category
      }
    ]).select();
    
    if (!error && data) {
      setNews(prev => [data[0], ...prev]);
    }
  };

  const deleteNewsItem = async (id) => {
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (!error) {
      setNews(prev => prev.filter(n => n.id !== id));
    }
  };

  const addSponsorItem = async (sponsorData) => {
    const { data, error } = await supabase.from('sponsors').insert([
      {
        name_ar: sponsorData.name,
        name_en: sponsorData.name,
        description_ar: sponsorData.desc,
        description_en: sponsorData.desc,
        logo_url: sponsorData.logo,
        website_link: sponsorData.link,
        tier: sponsorData.tier || 'gold'
      }
    ]).select();
    
    if (!error && data) {
      setSponsors(prev => [data[0], ...prev]);
      return { success: true };
    }
    return { success: false, error: error?.message };
  };

  const deleteSponsorItem = async (id) => {
    const { error } = await supabase.from('sponsors').delete().eq('id', id);
    if (!error) {
      setSponsors(prev => prev.filter(s => s.id !== id));
      return { success: true };
    }
    return { success: false, error: error?.message };
  };

  const updateSponsorItem = async (id, sponsorData) => {
    const { data, error } = await supabase
      .from('sponsors')
      .update({
        name_ar: sponsorData.name,
        name_en: sponsorData.name,
        description_ar: sponsorData.desc,
        description_en: sponsorData.desc,
        logo_url: sponsorData.logo,
        website_link: sponsorData.link,
        tier: sponsorData.tier || 'gold'
      })
      .eq('id', id)
      .select();

    if (!error && data && data.length > 0) {
      setSponsors(prev => prev.map(s => s.id === id ? data[0] : s));
      return { success: true };
    }
    return { success: false, error: error?.message };
  };



  const addDoctor = async (doctorData) => {
    const { data, error } = await supabase.from('doctors').insert([
      {
        name_ar: doctorData.name_ar,
        name_en: doctorData.name_en || doctorData.name_ar,
        speech_ar: doctorData.speech_ar,
        speech_en: doctorData.speech_en || doctorData.speech_ar,
        image_url: doctorData.image_url || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(doctorData.name_ar),
        title_ar: doctorData.title_ar,
        title_en: doctorData.title_en || doctorData.title_ar
      }
    ]).select();

    if (!error && data && data.length > 0) {
      setDoctors(prev => [...prev, data[0]]);
      return { success: true, data: data[0] };
    }
    return { success: false, error: error?.message || 'Failed to add doctor' };
  };

  const updateDoctorImage = async (id, imageUrl) => {
    const { data, error } = await supabase
      .from('doctors')
      .update({ image_url: imageUrl })
      .eq('id', id)
      .select();

    if (!error && data && data.length > 0) {
      setDoctors(prev => prev.map(d => d.id === id ? data[0] : d));
      return { success: true, data: data[0] };
    }
    return { success: false, error: error?.message || 'Failed to update doctor image' };
  };

  const deleteDoctor = async (id) => {
    const { data, error } = await supabase.from('doctors').delete().eq('id', id).select();
    if (!error && data && data.length > 0) {
      setDoctors(prev => prev.filter(d => d.id !== id));
      return { success: true };
    }
    return { success: false, error: error?.message || 'Failed to delete doctor' };
  };

  return (
    <DataContext.Provider value={{
      students, memories, news, sponsors, wishes, doctors, stats, loading,
      addWish, deleteWish, deleteStudent, addMemory, deleteMemory, updateMemoryLikes, updateMemory,
      updateStudentStatus, updateWishStatus, updateStudent,
      addNewsItem, deleteNewsItem, addSponsorItem, deleteSponsorItem, updateSponsorItem,
      addDoctor, updateDoctorImage, deleteDoctor
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
