"use client";

import React, { useState, useEffect } from 'react';
import { XMarkIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

interface UnitGalleryProps {
  images: string[];
}

export default function UnitGallery({ images }: UnitGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') nextImage(new MouseEvent('click') as any);
      if (e.key === 'ArrowLeft') prevImage(new MouseEvent('click') as any);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((img, i) => (
          <div 
            key={i} 
            onClick={() => openModal(i)}
            className="h-24 rounded-xl overflow-hidden border border-gray-200 cursor-zoom-in hover:opacity-80 transition block"
          >
            <img src={img} alt={`صورة ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeModal}
        >
          {/* Main Modal Box */}
          <div 
            className="relative bg-white p-4 md:p-6 rounded-3xl shadow-2xl max-w-4xl w-full mx-4 flex flex-col justify-center items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button inside the box */}
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition bg-gray-100 hover:bg-gray-200 p-2 rounded-full z-10"
              onClick={closeModal}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="relative w-full h-[60vh] md:h-[70vh] flex justify-center items-center mt-8">
              <img 
                src={images[selectedIndex]} 
                alt={`صورة مكبرة`} 
                className="max-w-full max-h-full object-contain rounded-xl select-none"
              />
              
              {/* Prev/Next Buttons */}
              {images.length > 1 && (
                <>
                  <button 
                    className="absolute -right-2 md:right-4 text-gray-800 hover:text-white hover:bg-primary transition bg-white/90 shadow-md backdrop-blur-sm p-2 rounded-full z-10"
                    onClick={nextImage}
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>

                  <button 
                    className="absolute -left-2 md:left-4 text-gray-800 hover:text-white hover:bg-primary transition bg-white/90 shadow-md backdrop-blur-sm p-2 rounded-full z-10"
                    onClick={prevImage}
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
            
            <div className="mt-4 text-gray-500 font-bold text-sm text-center bg-gray-100 px-4 py-1.5 rounded-full">
              صورة {selectedIndex + 1} من {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
