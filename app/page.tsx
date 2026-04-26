import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink, GraduationCap, Briefcase, Target, Star, Cpu, Code } from "lucide-react";


import dbConnect from "@/lib/mongodb";
import Profile from "@/models/Profile";
import Project from "@/models/Project";
import Certificate from "@/models/Certificate";
import CertificatesSection from "@/components/CertificatesSection";
import Hero from "@/components/Hero";
import SkillsSection from "@/components/SkillsSection";
import ReferencesSection from "@/components/ReferencesSection";
import profileImage from "@/public/profile-final.png";

export const dynamic = 'force-dynamic'; // Ensures fresh data is fetched on load and prevents static prerendering related DB crashes

export default async function Home() {
  await dbConnect();
  const profileDoc = await Profile.findOne();
  const projectsDoc = await Project.find({}).sort({ createdAt: -1 });
  const certificatesDoc = await Certificate.find({}).sort({ order: 1, createdAt: 1 });

  // Fallbacks if DB is empty
  const profile = profileDoc || {
    name: "Mulugeta Ketemaw",
    summary: "A motivated and dedicated Information Technology graduate with strong skills in web development and software systems.",
    professionalSummary: "Experienced in developing applications using modern technologies such as React, Node.js, and MongoDB. Passionate about problem solving, research, and innovation, with proven achievement in competitive projects.",
    phone: "+251 915 942 488",
    email: "mulugetaketemaw2@gmail.com",
    location: "Addis Ababa, Ethiopia"
  };

  const projects = projectsDoc.length > 0 ? projectsDoc : [
    {
      title: "Vital Event Registration System",
      description: "Developed a robust system to manage vital records including birth, death, and marriage. Passed a high-level innovation competition, demonstrating strong technical impact.",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      statusBadge: "Awarded Project",
      url: ""
    },
    {
      title: "Organizational Management System",
      description: "A comprehensive management system designed to streamline organizational workflows, community interactions, and record keeping.",
      technologies: ["Fullstack Dev", "Database Design", "Auth", "UI/UX"],
      statusBadge: "Successfully Implemented",
      url: ""
    }
  ];

  const defaultCerts = [
    { _id: "1", title: "Startup Innovation Founder", org: "Ministry of Innovation & Tech", imageUrl: "" },
    { _id: "2", title: "Ethics & Anti-Corruption (2x)", org: "Wollo University", imageUrl: "" },
    { _id: "3", title: "Ambassador of Ethics", org: "Wollo University", imageUrl: "" },
    { _id: "4", title: "Recognition Certificate", org: "Federal Anti-Corruption Commission", imageUrl: "" },
    { _id: "5", title: "Peace Forum Certificate", org: "Ethiopian Peace Forum", imageUrl: "" },
    { _id: "6", title: "Competition Certificates (2x)", org: "Innovation Awards", imageUrl: "" },
  ];
  const certificates = certificatesDoc.length > 0
    ? certificatesDoc.map((c: any) => ({ _id: c._id.toString(), title: c.title, org: c.org, imageUrl: c.imageUrl || "" }))
    : defaultCerts;

  return (
    <div className="flex flex-col">
      {/* 1. Hero / About Us Section */}
      <Hero profile={{ name: profile.name, summary: profile.summary }} profileImage={profileImage} />

      {/* 2. Professional Summary Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative">
          {/* Decorative quotes */}
          <div className="absolute top-0 left-0 text-orange/10 text-[12rem] font-serif leading-none -translate-x-12 -translate-y-8 select-none">“</div>
          <div className="absolute bottom-0 right-0 text-orange/10 text-[12rem] font-serif leading-none translate-x-12 translate-y-16 select-none">”</div>

          <div className="relative z-10 text-center space-y-10">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-bold text-navy">Professional Summary</h2>
              <div className="flex justify-center">
                <div className="h-1.5 w-24 bg-orange rounded-full"></div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-navy leading-relaxed font-serif italic font-medium">
                {profile.professionalSummary}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Skills & Languages Section */}
      <SkillsSection />

      {/* 4. Projects Section */}
      <section id="projects" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-4xl font-bold text-navy">Featured Projects</h2>
            <div className="section-line !w-16 mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {projects.map((proj: any, index: number) => {
              const isDark = index % 2 === 0;
              return (
                <div key={proj._id || index} className={`group relative rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-shadow ${isDark ? 'bg-navy shadow-2xl' : 'bg-white border-4 border-navy'}`}>
                  {proj.imageUrl && (
                    <div className="relative w-full h-56 overflow-hidden border-b-2 border-orange/20">
                      <Image
                        src={proj.imageUrl}
                        alt={proj.title}
                        fill={true}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>
                  )}

                  <div className="p-10 space-y-6">
                    <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-navy'}`}>{proj.title}</h3>

                    <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {proj.technologies.map((tech: string) => (
                        <span key={tech} className={`px-3 py-1 rounded-full text-sm font-medium ${isDark ? 'text-gray-400 border border-white/20' : 'text-navy bg-gray-light'}`}>
                          {tech}
                        </span>
                      ))}
                    </div>
                    {(proj.url || proj.githubUrl) && (
                      <div className="pt-4 flex flex-wrap gap-6">
                        {proj.url && (
                          <a href={proj.url} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-2 font-bold text-orange hover:underline decoration-2 underline-offset-4">
                            <span>View Live</span>
                            <ExternalLink size={18} />
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" className={`inline-flex items-center space-x-2 font-bold hover:underline decoration-2 underline-offset-4 ${isDark ? 'text-white' : 'text-navy'}`}>
                            <Code size={18} />
                            <span>Code Repo</span>
                          </a>
                        )}

                      </div>
                    )}

                  </div>
                  <div className="h-2 bg-orange w-0 group-hover:w-full transition-all duration-500"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Certificates & Recognition Section */}
      <section id="certificates" className="py-24 navy-gradient text-white">
        <div className="max-w-7xl mx-auto px-6 text-white">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4 space-y-6 text-center lg:text-left">
              <h2 className="text-4xl font-bold">Certificates & Recognition</h2>
              <div className="h-1.5 w-20 bg-orange mx-auto lg:mx-0"></div>
              <p className="text-gray-400 text-lg">
                Recognized for excellence in innovation, ethics, and community leadership through various national and university awards.
              </p>
            </div>

            <CertificatesSection certificates={certificates} />
          </div>
        </div>
      </section>

      {/* 6. Education & Experience Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20">
          {/* Education */}
          <div className="space-y-12">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-navy rounded-2xl text-white"><GraduationCap /></div>
              <h2 className="text-3xl font-bold text-navy">Education</h2>
            </div>

            <div className="space-y-10 border-l-2 border-gray-medium ml-6 pl-10 relative">
              <div className="relative">
                <div className="absolute -left-13 top-0 w-6 h-6 bg-white border-4 border-orange rounded-full"></div>
                <h4 className="text-gray-500 font-bold mb-2">2014 – 2018</h4>
                <h3 className="text-2xl font-bold text-navy">BSc in Information Technology</h3>
                <p className="text-orange font-semibold">Wollo University, Ethiopia</p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex items-center space-x-3 bg-navy/5 px-4 py-2 rounded-2xl border border-navy/10 group hover:bg-navy hover:text-white transition-all duration-300">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-white/70">CGPA</span>
                    <span className="text-lg font-bold text-navy group-hover:text-white transition-colors">3.59</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-orange/5 px-4 py-2 rounded-2xl border border-orange/10 group hover:bg-orange hover:text-white transition-all duration-300">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-white/70">Exit Exam</span>
                    <span className="text-lg font-bold text-orange group-hover:text-white transition-colors">60</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-13 top-0 w-6 h-6 bg-white border-4 border-navy rounded-full"></div>
                <h4 className="text-gray-500 font-bold mb-2">2010 – 2013</h4>
                <h3 className="text-2xl font-bold text-navy">Preparatory Education</h3>
                <p className="text-gray-500">South Wollo, Marye High School</p>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-12">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange rounded-2xl text-white"><Briefcase /></div>
              <h2 className="text-3xl font-bold text-navy">Experience</h2>
            </div>

            <div className="space-y-10 border-l-2 border-gray-medium ml-6 pl-10 relative">
              <div className="relative">
                <div className="absolute -left-13 top-0 w-6 h-6 bg-white border-4 border-orange rounded-full"></div>
                <h4 className="text-gray-500 font-bold mb-2">Internal Internship</h4>
                <h3 className="text-2xl font-bold text-navy">App Factory Academy</h3>
                <p className="text-orange font-semibold">Wollo University</p>
                <ul className="mt-4 space-y-3 text-gray-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-orange mt-1">✓</span>
                    <span>Participated in various software development projects.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-orange mt-1">✓</span>
                    <span>Gained practical experience in modern application architecture.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-orange mt-1">✓</span>
                    <span>Worked collaboratively in high-performing team environments.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Contact Me Section */}
      <section id="contact" className="py-24 bg-gray-light relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center mb-12">
            <h4 className="text-orange font-bold tracking-widest uppercase text-sm mb-3">Contact Me</h4>
            <h2 className="text-4xl font-bold text-navy mb-4">Get In Touch</h2>
            <div className="h-1.5 w-16 bg-orange rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Phone Card */}
            <a
              href={`tel:${profile.phone}`}
              className="group bg-navy p-8 rounded-3xl shadow-xl hover:shadow-navy/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center text-white"
            >
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:rotate-6 transition-all duration-500">
                <Phone className="text-white group-hover:text-navy transition-colors" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Phone</h3>
              <p className="text-white/60 mb-4 text-xs italic">Call or Text</p>
              <span className="text-base font-bold break-all">{profile.phone}</span>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${profile.email}`}
              className="group bg-orange p-8 rounded-3xl shadow-xl hover:shadow-orange/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center text-white"
            >
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:-rotate-6 transition-all duration-500">
                <Mail className="text-white group-hover:text-orange transition-colors" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-white/60 mb-4 text-xs italic">Send a Message</p>
              <span className="text-sm font-bold whitespace-nowrap">{profile.email}</span>
            </a>

            {/* Location Card */}
            <div
              className="group bg-cyan-700 p-8 rounded-3xl shadow-xl hover:shadow-cyan-700/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center text-white"
            >
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:rotate-6 transition-all duration-500">
                <MapPin className="text-white group-hover:text-cyan-700 transition-colors" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Location</h3>
              <p className="text-white/60 mb-4 text-xs italic">Based In</p>
              <span className="text-base font-bold">{profile.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer / References */}
      <ReferencesSection />

      {/* 9. Footer */}
      <section className="py-20 bg-white border-t border-gray-medium">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2026 {profile.name}. Designed for Excellence.</p>
          <div className="flex justify-center space-x-8 mt-4">
            <Link href="#" className="hover:text-orange transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-orange transition-colors">Terms of Service</Link>
          </div>
        </div>
      </section>
    </div>
  );
}