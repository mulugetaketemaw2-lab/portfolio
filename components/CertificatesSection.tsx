"use client";

import { useState } from "react";
import { Award, X, ZoomIn } from "lucide-react";
import Image from "next/image";

interface Certificate {
  _id: string;
  title: string;
  org: string;
  imageUrl: string;
}

interface Props {
  certificates: Certificate[];
}

export default function CertificatesSection({ certificates }: Props) {
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <>
      {/* Certificate Cards Grid */}
      <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
        {certificates.map((cert, index) => (
          <div
            key={cert._id || index}
            onClick={() => cert.imageUrl ? setSelected(cert) : undefined}
            className={`flex space-x-5 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 group text-white transition-all duration-300 shadow-xl ${
              cert.imageUrl
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
              {cert.imageUrl && (
                <p className="text-xs text-orange/70 mt-1 flex items-center gap-1">
                  <ZoomIn size={12} />
                  Click to view certificate
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative bg-navy rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white">{selected.title}</h3>
                <p className="text-sm text-gray-400">{selected.org}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Certificate Image */}
            <div className="relative w-full" style={{ minHeight: "400px" }}>
              <Image
                src={selected.imageUrl}
                alt={selected.title}
                fill={true}
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
