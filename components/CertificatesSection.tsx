"use client";

import { useState } from "react";
import { Award, X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Certificate {
  _id: string;
  title: string;
  org: string;
  imageUrl: string;
  imageUrls?: string[];
}

interface Props {
  certificates: Certificate[];
}

export default function CertificatesSection({ certificates }: Props) {
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleOpen = (cert: Certificate) => {
    setSelected(cert);
    setCurrentIndex(0);
  };

  const getImages = (cert: Certificate) => {
    const urls = cert.imageUrls && cert.imageUrls.length > 0 ? cert.imageUrls : [cert.imageUrl];
    return urls.filter(url => url);
  };

  return (
    <>
      {/* Certificate Cards Grid */}
      <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
        {certificates.map((cert, index) => {
          const images = getImages(cert);
          const hasImages = images.length > 0 && !failedImages[cert._id];

          return (
            <div
              key={cert._id || index}
              onClick={() => hasImages ? handleOpen(cert) : undefined}
              className={`flex space-x-5 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 group text-white transition-all duration-300 shadow-xl ${
                hasImages
                  ? "hover:bg-white/10 hover:border-orange/40 cursor-pointer hover:-translate-y-1 hover:shadow-orange/5"
                  : "hover:bg-white/10 cursor-default"
              }`}
            >
            <div className="min-w-[48px] h-12 bg-orange/20 rounded-xl flex items-center justify-center text-orange group-hover:bg-orange group-hover:text-white transition-all">
              <Award />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-lg text-white">{cert.title}</h4>
              <p className="text-sm text-gray-400">{cert.org}</p>
              {hasImages && (
                <p className="text-xs text-orange/70 mt-1 flex items-center gap-1">
                  <ZoomIn size={12} />
                  {images.length > 1 ? `View ${images.length} images` : "Click to view certificate"}
                </p>
              )}
            </div>
            {/* Hidden image to test loading */}
            {cert.imageUrl && !failedImages[cert._id] && (
              <div className="hidden">
                <img 
                  src={cert.imageUrl} 
                  alt=""
                  onError={() => setFailedImages(prev => ({ ...prev, [cert._id]: true }))} 
                />
              </div>
            )}
          </div>
        );
      })}
      </div>

      {/* Lightbox Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative bg-navy rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-white/10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-navy/50 backdrop-blur-md">
              <div>
                <h3 className="text-2xl font-bold text-white">{selected.title}</h3>
                <p className="text-sm text-gray-400">{selected.org}</p>
              </div>
              <div className="flex items-center gap-4">
                {getImages(selected).length > 1 && (
                  <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-white/70">
                    {currentIndex + 1} / {getImages(selected).length}
                  </span>
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Certificate Image Slider */}
            <div className="relative flex-1 flex items-center justify-center bg-black/40 group">
              {getImages(selected).length > 1 && (
                <>
                  {/* Previous Button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev === 0 ? getImages(selected).length - 1 : prev - 1)); }}
                    className="absolute left-6 z-10 flex flex-col items-center gap-2 text-white/70 hover:text-white transition-all group/btn"
                  >
                    <div className="p-4 rounded-full backdrop-blur-md border animate-pulse-subtle group-hover/btn:bg-orange group-hover/btn:border-orange group-hover/btn:scale-110 transition-all shadow-2xl">
                      <ChevronLeft size={36} />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover/btn:opacity-100 transition-opacity">Previous</span>
                  </button>

                  {/* Next Button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev === getImages(selected).length - 1 ? 0 : prev + 1)); }}
                    className="absolute right-6 z-10 flex flex-col items-center gap-2 text-white/70 hover:text-white transition-all group/btn"
                  >
                    <div className="p-4 rounded-full backdrop-blur-md border animate-pulse-subtle group-hover/btn:bg-orange group-hover/btn:border-orange group-hover/btn:scale-110 transition-all shadow-2xl">
                      <ChevronRight size={36} />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover/btn:opacity-100 transition-opacity">Next View</span>
                  </button>
                </>
              )}
              
              <div className="relative w-full h-[60vh] md:h-[75vh]">
                <Image
                  src={getImages(selected)[currentIndex]}
                  alt={`${selected.title} - ${currentIndex + 1}`}
                  fill={true}
                  className="object-contain p-4 md:p-8"
                  priority
                  sizes="(max-width: 768px) 100vw, 1024px"
                />
              </div>

              {/* Thumbnails indicator at bottom */}
              {getImages(selected).length > 1 && (
                <div className="absolute bottom-6 flex gap-2">
                  {getImages(selected).map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? "bg-orange w-8 shadow-[0_0_10px_rgba(255,107,53,0.8)]" : "bg-white/30 hover:bg-white/50"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
