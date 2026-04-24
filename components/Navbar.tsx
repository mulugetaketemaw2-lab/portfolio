"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, FileText, Briefcase, Award, Cpu, LogIn, Menu, X, Mail, Phone, MapPin, ChevronDown } from "lucide-react";


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Skill", href: "#skills", icon: <Cpu size={18} /> },
    { name: "Project", href: "#projects", icon: <Briefcase size={18} /> },
    { name: "Certificate", href: "#certificates", icon: <Award size={18} /> },
  ];

  // Hide the navbar entirely on any admin route
  // The early return must be placed after ALL hooks are called to respect React hook rules.
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass py-3 shadow-md" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo / Name */}
        <Link 
          href="/" 
          className={`text-2xl font-bold font-serif tracking-tight transition-colors ${
            isScrolled ? "text-navy" : "text-white"
          }`}
        >
          MK<span className="text-orange">.</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="#about"
            className="flex items-center space-x-2 px-5 py-2 bg-orange text-white rounded-full font-bold hover:bg-orange/90 transition-all shadow-lg hover:shadow-orange/30 active:scale-95"
          >
            <User size={18} />
            <span>About Us</span>
          </Link>
          <div className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-2 font-medium transition-colors hover:text-orange ${
                  isScrolled ? "text-navy" : "text-white"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}

            <Link
              href="#contact"
              className={`flex items-center space-x-2 font-medium transition-colors hover:text-orange ${
                isScrolled ? "text-navy" : "text-white"
              }`}
            >
              <Mail size={18} />
              <span>Contact</span>
            </Link>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/api/cv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-5 py-2 bg-navy text-white rounded-full font-semibold hover:bg-navy-light transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <FileText size={18} />
            <span>Preview CV</span>
          </Link>
          <Link
            href="/admin"
            title="Admin Dashboard"
            className={`p-2 rounded-full border transition-all ${
              isScrolled 
                ? "border-navy text-navy hover:bg-navy hover:text-white" 
                : "border-white text-white hover:bg-white hover:text-navy"
            }`}
          >
            <LogIn size={20} />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden p-2 transition-colors ${
            isScrolled ? "text-navy" : "text-white"
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 space-y-4">
            <Link
              href="#about"
              className="flex items-center justify-center space-x-2 bg-orange text-white p-3 rounded-lg font-bold shadow-md hover:shadow-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User size={20} />
              <span>About Us</span>
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center space-x-3 text-navy text-lg font-medium p-2 hover:bg-gray-light rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}

            <Link
              href="#contact"
              className="flex items-center space-x-3 text-navy text-lg font-medium p-2 hover:bg-gray-light rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Mail size={18} />
              <span>Contact</span>
            </Link>

            <div className="h-px bg-gray-medium my-2"></div>
            <Link
              href="/api/cv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-navy text-white p-3 rounded-lg font-bold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FileText size={20} />
              <span>Preview CV</span>
            </Link>
            <Link
              href="/admin"
              className="flex items-center justify-center space-x-2 border-2 border-navy text-navy p-3 rounded-lg font-bold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LogIn size={20} />
              <span>Admin Sign In</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
