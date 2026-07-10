import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import GalleryLightbox from '../components/ui/GalleryLightbox';
import Modal from '../components/ui/Modal';

export default function MemoriesPage() {
  const { locale } = useLanguage();
  const { memories, updateMemoryLikes } = useData();

  // Filter category state
  const [activeFilter, setActiveFilter] = useState('all'); // all, ceremony, projects, trips, campus

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Video modal state
  const [selectedVideo, setSelectedVideo] = useState(null);

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'ceremony': return locale === 'ar' ? 'الحفل' : 'Ceremony';
      case 'projects': return locale === 'ar' ? 'مشاريع التخرج' : 'Graduation Projects';
      case 'trips': return locale === 'ar' ? 'الرحلات' : 'Trips';
      case 'campus': return locale === 'ar' ? 'الحياة الجامعية' : 'Campus Life';
      default: return cat;
    }
  };

  const getThumbnailUrl = (url) => {
    if (!url) return '';
    if (url.includes('/public/gallery/') && !url.includes('_thumb.')) {
      return url.replace(/(\.[a-zA-Z0-9]+)(?=\?|$)/, '_thumb$1');
    }
    return url;
  };

  const imagesOnly = memories.filter(m => m.media_type === 'image');
  const videosOnly = memories.filter(m => m.media_type === 'video');

  // Filter images
  const filteredMemories = imagesOnly.filter(m => {
    if (activeFilter === 'all') return true;
    return m.category === activeFilter;
  });

  const handleImageClick = (id) => {
    // Find index of clicked item in the filtered list
    const idx = filteredMemories.findIndex(m => m.id === id);
    if (idx !== -1) {
      setCurrentIndex(idx);
      setLightboxOpen(true);
    }
  };

  const filters = [
    { id: 'all', label: locale === 'ar' ? 'الكل' : 'All' },
    { id: 'ceremony', label: locale === 'ar' ? 'الحفل' : 'Ceremony' },
    { id: 'projects', label: locale === 'ar' ? 'مشاريع التخرج' : 'Graduation Projects' },
    { id: 'trips', label: locale === 'ar' ? 'الرحلات' : 'Trips' },
    { id: 'campus', label: locale === 'ar' ? 'الحياة الجامعية' : 'Campus Life' }
  ];

  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    // YouTube Check
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      if (url.includes('/embed/')) return url;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
      }
    }
    
    // Instagram Check
    if (url.includes('instagram.com')) {
      let cleanUrl = url.trim();
      if (cleanUrl.endsWith('/')) {
        cleanUrl = cleanUrl.slice(0, -1);
      }
      if (!cleanUrl.endsWith('/embed')) {
        return `${cleanUrl}/embed/`;
      }
      return `${cleanUrl}/`;
    }

    // TikTok Check
    if (url.includes('tiktok.com')) {
      const match = url.match(/\/video\/(\d+)/);
      if (match) {
        return `https://www.tiktok.com/embed/v2/${match[1]}`;
      }
      if (url.includes('/embed/')) return url;
    }

    // X/Twitter Check
    if (url.includes('twitter.com') || url.includes('x.com')) {
      const match = url.match(/\/status\/(\d+)/);
      if (match) {
        return `https://platform.twitter.com/embed/Tweet.html?id=${match[1]}&theme=dark`;
      }
    }

    // Google Drive Check
    if (url.includes('drive.google.com')) {
      if (url.includes('/view')) {
        return url.replace(/\/view.*/, '/preview');
      }
      return url;
    }

    // Dropbox Check
    if (url.includes('dropbox.com')) {
      return url.replace('dl=0', 'raw=1');
    }
    
    return url;
  };

  const isDirectVideo = (url) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || url.includes('raw=1');
  };

  const getVideoThumbnail = (url) => {
    if (!url) return '';
    
    // YouTube Check
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`;
      }
    }
    
    // Instagram Check
    if (url.includes('instagram.com')) {
      return 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop';
    }

    // TikTok Check
    if (url.includes('tiktok.com')) {
      return 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop';
    }

    // X/Twitter Check
    if (url.includes('twitter.com') || url.includes('x.com')) {
      return 'https://images.unsplash.com/photo-1611605698335-8b15d27e03f3?q=80&w=600&auto=format&fit=crop';
    }

    // Google Drive Check
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (match) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w600`;
      }
    }
    
    return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop';
  };

  return (
    <div className="w-full max-w-container-max mx-auto px-4 md:px-8 py-12 md:py-24">
      {/* Title */}
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl text-primary mb-6 font-bold leading-tight">
          {locale === 'ar' ? 'معرض صور وفيديوهات الذكريات' : 'Memories Gallery & Videos'}
        </h1>
        <p className="text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
          {locale === 'ar' 
            ? 'تصفح اللحظات الخالدة ومقاطع الفيديو التوثيقية لدفعة التخرج ومشاريعهم المميزة.' 
            : 'Explore the timeless moments, documentary videos of the graduating class, and their outstanding projects.'}
        </p>
      </header>

      {/* Categories Tabs Filter */}
      <section className="flex flex-wrap justify-center gap-4 mb-12 border-b border-primary/10 pb-6 select-none">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`text-sm px-5 py-2.5 transition-colors cursor-pointer border-0 font-bold uppercase tracking-wider ${
              activeFilter === filter.id 
                ? 'bg-[#c59e62] text-primary shadow-sm' 
                : 'bg-surface-container text-secondary hover:text-primary hover:bg-[#F5E6D3] dark:hover:bg-surface-container'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </section>

      {/* Bento Grid Photos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
        {filteredMemories.map((item) => (
          <article
            key={item.id}
            className="group relative flex flex-col bg-[#F5E6D3] dark:bg-surface-container border border-[#c59e62]/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div 
              onClick={() => handleImageClick(item.id)}
              className="relative w-full aspect-square overflow-hidden cursor-pointer"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                src={getThumbnailUrl(item.url)}
                alt={item[`title_${locale}`]}
                loading="lazy"
                onError={(e) => {
                  if (e.target.src !== item.url) {
                    e.target.src = item.url;
                  }
                }}
              />
              {/* Category Tag */}
              <span className="absolute top-3 left-3 bg-primary/85 text-[#c59e62] text-xs font-bold px-2 py-1 shadow border border-[#c59e62]/20 rounded select-none z-20">
                {getCategoryLabel(item.category)}
              </span>
              {/* Overlay with magnifying glass zoom icon */}
              <div className="absolute inset-0 bg-primary/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                <span className="material-symbols-outlined text-4xl text-white font-bold bg-[#c59e62]/90 p-3 rounded-full shadow-lg">
                  zoom_in
                </span>
              </div>
            </div>

            {/* Info under the image */}
            <div className="p-4 flex flex-col gap-1 bg-[#F5E6D3] dark:bg-surface-container border-t border-outline-variant/20">
              <div className="flex justify-between items-start gap-3">
                <h3 className="font-bold text-primary text-base leading-tight text-right rtl:text-right ltr:text-left">
                  {item[`title_${locale}`]}
                </h3>
                
                {/* Direct Download button */}
                <a 
                  href={item.url} 
                  download={`memory_${item.id}.jpg`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-secondary hover:text-[#c59e62] transition-colors p-1 flex items-center justify-center shrink-0"
                  aria-label="Download Image"
                >
                  <span className="material-symbols-outlined text-xl font-bold">download</span>
                </a>
              </div>
              <span className="text-secondary text-[11px] font-bold text-right rtl:text-right ltr:text-left">
                {new Date(item.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
              </span>
            </div>
          </article>
        ))}
      </section>

      {/* Videos Section */}
      <section className="mt-28 w-full border-t border-[#c59e62]/20 pt-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl text-primary font-bold">
            {locale === 'ar' ? 'قسم مقاطع الفيديو والوثائقيات' : 'Documentary Video Section'}
          </h2>
          <div className="w-24 h-px bg-on-tertiary-container mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videosOnly.map(video => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="bg-[#F5E6D3] dark:bg-surface-container border border-outline-variant/20 p-4 shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative w-full aspect-video overflow-hidden bg-black">
                {isDirectVideo(video.url) ? (
                  <video
                    src={video.url}
                    preload="metadata"
                    muted
                    playsInline
                    className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                ) : (
                  <img
                    src={video.cover_url || getVideoThumbnail(video.url)}
                    alt=""
                    className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                )}
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover:bg-black/20 z-10">
                  <span className="material-symbols-outlined text-5xl text-[#c59e62] font-bold group-hover:scale-110 transition-transform">
                    play_circle
                  </span>
                </div>
              </div>
              <h3 className="text-sm text-primary font-bold mt-4 mb-2 text-center group-hover:text-[#c59e62] transition-colors leading-relaxed">
                {video[`title_${locale}`]}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Image Lightbox */}
      {lightboxOpen && (
        <GalleryLightbox
          image={filteredMemories[currentIndex]}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setCurrentIndex((prev) => (prev - 1 + filteredMemories.length) % filteredMemories.length)}
          onNext={() => setCurrentIndex((prev) => (prev + 1) % filteredMemories.length)}
        />
      )}

      {/* Video Modal Player */}
      <Modal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        title={selectedVideo ? selectedVideo[`title_${locale}`] : ''}
      >
        {selectedVideo && (
          <div className="relative aspect-video w-full bg-black">
            {isDirectVideo(selectedVideo.url) ? (
              <video
                src={selectedVideo.url}
                controls
                autoPlay
                className="absolute inset-0 w-full h-full object-contain"
              />
            ) : (
              <iframe
                src={getEmbedUrl(selectedVideo.url)}
                title="Video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0 shadow-sm"
              ></iframe>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
