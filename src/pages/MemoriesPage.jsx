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
                src={item.url}
                alt={item[`title_${locale}`]}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center z-10 gap-3">
                <span className="text-xl text-[#c59e62] font-bold">{item[`title_${locale}`]}</span>
                <span className="text-white/60 text-xs font-bold">{new Date(item.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</span>
              </div>
            </div>

            {/* Interactions Bar */}
            <div className="p-4 flex justify-between items-center bg-[#F5E6D3] dark:bg-surface-container border-t border-outline/10 select-none">
              <div className="flex gap-4">
                <button
                  onClick={() => updateMemoryLikes(item.id, (item.likes || 0) + 1)}
                  className="text-secondary hover:text-primary transition-colors flex items-center gap-2 group/btn p-2"
                  aria-label="Like Memory"
                >
                  <span className="material-symbols-outlined text-2xl font-bold group-hover/btn:scale-110 transition-transform">
                    favorite
                  </span>
                  <span className="text-sm font-bold text-primary">{item.likes || 0}</span>
                </button>
              </div>
              
              {/* Direct Download button */}
              <a 
                href={item.url} 
                download={`memory_${item.id}.jpg`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-outline hover:text-primary transition-colors p-2 flex items-center justify-center"
                aria-label="Download Image"
              >
                <span className="material-symbols-outlined text-2xl font-bold">download</span>
              </a>
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
              <div className="relative w-full aspect-video overflow-hidden">
                <img
                  src={video.url}
                  alt=""
                  className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-500"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover:bg-black/50 z-10">
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
          <div className="relative aspect-video w-full">
            <iframe
              src={selectedVideo.url} // Assuming URL for video is youtube embed link
              title="Video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0 shadow-sm"
            ></iframe>
          </div>
        )}
      </Modal>
    </div>
  );
}
