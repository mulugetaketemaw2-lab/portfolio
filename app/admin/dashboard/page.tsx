"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Upload, Trash2, Edit2, CheckCircle, XCircle, ImagePlus, Award, User, Briefcase, FileText } from "lucide-react";

import Image from "next/image";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile State
  const [profile, setProfile] = useState<any>({});
  const [savingProfile, setSavingProfile] = useState(false);

  // Projects State
  const [projects, setProjects] = useState<any[]>([]);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>({
    title: "", description: "", technologies: "", url: "", githubUrl: "", imageUrl: ""

  });
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  const [uploadingProjectImage, setUploadingProjectImage] = useState(false);
  const [projectMessage, setProjectMessage] = useState("");
  const projectImageRef = useRef<HTMLInputElement>(null);


  // CV Upload State
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  // Certificates State
  const [certificates, setCertificates] = useState<any[]>([]);
  const [certForm, setCertForm] = useState({ title: "", org: "" });
  const [editingCert, setEditingCert] = useState<any>(null);
  const [certImageFile, setCertImageFile] = useState<File | null>(null);
  const [uploadingCertImage, setUploadingCertImage] = useState(false);
  const [certMessage, setCertMessage] = useState("");
  const certImageRef = useRef<HTMLInputElement>(null);

  // Profile Photo State
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");
  const photoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
    fetchProjects();
    fetchCertificates();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch("/api/profile");
    const data = await res.json();
    if (data.success) setProfile(data.data);
  };

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    if (data.success) setProjects(data.data);
  };

  const fetchCertificates = async () => {
    const res = await fetch("/api/certificates");
    const data = await res.json();
    if (data.success) setCertificates(data.data);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  // Profile Handlers
  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });
    setSavingProfile(false);
    alert("Profile saved successfully");
  };

  // Project Handlers
  const saveProject = async (e: React.FormEvent) => {
    setUploadingProjectImage(true);
    let imageUrl = currentProject.imageUrl || "";

    // Upload image if selected
    if (projectImageFile) {
      const formData = new FormData();
      formData.append("file", projectImageFile);
      const imgRes = await fetch("/api/upload-project-image", { method: "POST", body: formData });
      const imgData = await imgRes.json();
      if (imgData.success) {
        imageUrl = imgData.url;
      }
    }

    let payload = { ...currentProject, imageUrl };
    if (typeof payload.technologies === "string") {
      payload.technologies = payload.technologies.split(",").map((t: string) => t.trim());
    }
    const url = isEditingProject ? `/api/projects/${currentProject._id}` : "/api/projects";
    const method = isEditingProject ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    setUploadingProjectImage(false);

    if (data.success) {
      setProjectMessage(isEditingProject ? "Project updated successfully!" : "Project added successfully!");
      setIsEditingProject(false);
      setProjectImageFile(null);
      if (projectImageRef.current) projectImageRef.current.value = "";
      setCurrentProject({ title: "", description: "", technologies: "", url: "", githubUrl: "", imageUrl: "" });
      fetchProjects();
    } else {
      setProjectMessage(data.message || "Operation failed.");
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setProjectMessage("Deleting...");
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setProjectMessage("Project deleted successfully.");
      fetchProjects();
    } else {
      setProjectMessage(data.message || "Failed to delete project.");
    }
  };

  const editProject = (proj: any) => {
    setCurrentProject({ ...proj, technologies: proj.technologies.join(", ") });
    setIsEditingProject(true);
    setActiveTab("projects");
  };

  // CV Upload Handler
  const uploadCv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) return;
    setUploadingCv(true);
    setUploadMessage("");
    const formData = new FormData();
    formData.append("file", cvFile);
    const res = await fetch("/api/upload-cv", { method: "POST", body: formData });
    const data = await res.json();
    setUploadingCv(false);
    if (data.success) {
      setUploadMessage("CV uploaded successfully! It is now live.");
      setCvFile(null);
    } else {
      setUploadMessage(data.message || "Failed to upload CV.");
    }
  };

  // Certificate Handlers
  const saveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCertMessage("");

    let imageUrl = editingCert?.imageUrl || "";

    // Upload image first if one is selected
    if (certImageFile) {
      setUploadingCertImage(true);
      const formData = new FormData();
      formData.append("file", certImageFile);
      const imgRes = await fetch("/api/upload-certificate", { method: "POST", body: formData });
      const imgData = await imgRes.json();
      setUploadingCertImage(false);
      if (!imgData.success) {
        setCertMessage("Image upload failed. Try again.");
        return;
      }
      imageUrl = imgData.url;
    }

    const payload = { title: certForm.title, org: certForm.org, imageUrl };

    if (editingCert) {
      await fetch(`/api/certificates/${editingCert._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setCertMessage("Certificate updated!");
    } else {
      await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setCertMessage("Certificate added!");
    }

    setCertForm({ title: "", org: "" });
    setCertImageFile(null);
    setEditingCert(null);
    if (certImageRef.current) certImageRef.current.value = "";
    fetchCertificates();
  };

  const startEditCert = (cert: any) => {
    setEditingCert(cert);
    setCertForm({ title: cert.title, org: cert.org });
    setCertImageFile(null);
    setCertMessage("");
  };

  const deleteCertificate = async (id: string) => {
    if (!confirm("Delete this certificate?")) return;
    await fetch(`/api/certificates/${id}`, { method: "DELETE" });
    fetchCertificates();
  };

  // Profile Photo Handler
  const uploadProfilePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile) return;
    setUploadingPhoto(true);
    setPhotoMessage("");
    const formData = new FormData();
    formData.append("file", photoFile);
    const res = await fetch("/api/upload-profile-photo", { method: "POST", body: formData });
    const data = await res.json();
    setUploadingPhoto(false);
    if (data.success) {
      setPhotoMessage("Profile photo updated! Refresh the portfolio to see it.");
      setPhotoFile(null);
      setPhotoPreview(null);
      if (photoRef.current) photoRef.current.value = "";
    } else {
      setPhotoMessage(data.message || "Upload failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative overflow-hidden">
      {/* Background Mesh Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-navy/5 rounded-full blur-[150px] animate-pulse delay-1000"></div>

      {/* Sidebar */}
      <div className="w-full md:w-72 bg-navy text-white flex flex-col relative z-20 shadow-2xl">
        <div className="p-8">
          <h1 className="text-2xl font-extrabold font-serif tracking-tight">
            Admin <span className="text-orange">Panel</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1 font-bold">Portfolio Manager</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { id: "profile", label: "Profile Info", icon: <User size={18} /> },
            { id: "projects", label: "Manage Projects", icon: <Briefcase size={18} /> },
            { id: "certificates", label: "Certificates", icon: <Award size={18} /> },
            { id: "cv", label: "Upload CV", icon: <FileText size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "projects") {
                  setIsEditingProject(false);
                  setCurrentProject({ title: "", description: "", technologies: "", url: "", githubUrl: "" });
                }
              }}
              className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center space-x-3 group ${
                activeTab === tab.id 
                  ? "bg-orange text-white shadow-lg shadow-orange/20 translate-x-2" 
                  : "hover:bg-white/5 text-white/70 hover:text-white"
              }`}
            >
              <span className={`${activeTab === tab.id ? "text-white" : "text-orange group-hover:text-orange"} transition-colors`}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Portfolio Structure Indicator (Mini-Map) */}
        <div className="p-6 m-4 bg-white/5 rounded-3xl border border-white/10">
          <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-4">Portfolio Structure</p>
          <div className="space-y-2">
            {[
              { id: "profile", label: "Hero & About", active: activeTab === "profile" },
              { id: "profile", label: "Skills", active: activeTab === "profile" },
              { id: "projects", label: "Projects", active: activeTab === "projects" },
              { id: "certificates", label: "Certificates", active: activeTab === "certificates" },
              { id: "cv", label: "CV Preview", active: activeTab === "cv" },
            ].map((section, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${section.active ? "bg-orange scale-150 shadow-[0_0_8px_rgba(255,107,53,0.8)]" : "bg-white/10"}`}></div>
                <span className={`text-[11px] font-medium transition-colors ${section.active ? "text-white" : "text-white/30"}`}>{section.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 mt-auto border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors font-bold text-sm w-full p-2 hover:bg-red-400/10 rounded-xl">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>


      {/* Main Content */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <h2 className="text-4xl font-extrabold text-navy capitalize tracking-tight">
              {activeTab.replace("-", " ")}
              <span className="text-orange block text-sm uppercase tracking-[0.3em] font-bold mt-2">Management Console</span>
            </h2>
          </header>


        {/* ── Profile Tab ── */}
        {activeTab === "profile" && (
          <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-right-4 duration-500">

            {/* Profile Photo Upload Card */}
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-navy/5 border border-white/50 group hover:shadow-2xl transition-all duration-500">

              <h3 className="text-lg font-bold text-navy mb-1">Profile Photo</h3>
              <p className="text-sm text-gray-500 mb-6">This is the photo shown in the hero section of your portfolio.</p>
              <form onSubmit={uploadProfilePhoto} className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Current / Preview */}
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-orange/30 flex-shrink-0 bg-gray-100 shadow-lg">
                  <Image
                    src={photoPreview || "/profile-final.png"}
                    alt="Profile"
                    fill
                    className="object-cover rounded-full"
                    key={photoPreview || "current"}
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-orange transition-colors">
                    <input
                      ref={photoRef}
                      type="file"
                      id="profilePhotoFile"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setPhotoFile(f);
                        if (f) setPhotoPreview(URL.createObjectURL(f));
                      }}
                    />
                    <label htmlFor="profilePhotoFile" className="cursor-pointer flex flex-col items-center">
                      <ImagePlus size={28} className="text-gray-400 mb-2" />
                      <span className="text-gray-700 font-medium text-sm">
                        {photoFile ? photoFile.name : "Click to choose new photo"}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</span>
                    </label>
                  </div>

                  {photoMessage && (
                    <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                      photoMessage.includes("updated") ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"
                    }`}>
                      {photoMessage.includes("updated") ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      {photoMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!photoFile || uploadingPhoto}
                    className="w-full py-3 bg-orange text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    <Upload size={18} />
                    {uploadingPhoto ? "Uploading..." : "Save New Photo"}
                  </button>
                </div>
              </form>
            </div>

            {/* Profile Info Form */}
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-navy/5 border border-white/50 group hover:shadow-2xl transition-all duration-500">

              <h3 className="text-lg font-bold text-navy mb-6">Profile Details</h3>
              <form onSubmit={saveProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name</label>
                <input type="text" value={profile.name || ""} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Short Summary (Hero Section)</label>
                <textarea rows={3} value={profile.summary || ""} onChange={(e) => setProfile({ ...profile, summary: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Professional Summary (About Section)</label>
                <textarea rows={4} value={profile.professionalSummary || ""} onChange={(e) => setProfile({ ...profile, professionalSummary: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Phone</label>
                  <input type="text" value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
                  <input type="email" value={profile.email || ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800" />
                </div>
              </div>
              <button type="submit" disabled={savingProfile} className="px-6 py-3 bg-navy text-white font-bold rounded-xl hover:opacity-90">
                {savingProfile ? "Saving..." : "Save Profile Updates"}
              </button>
            </form>
            </div>
          </div>
        )}

        {/* ── Projects Tab ── */}
        {activeTab === "projects" && (
          <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="lg:col-span-5 bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-navy/5 border border-white/50 h-fit">

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-navy">{isEditingProject ? "Edit Project" : "Add New Project"}</h3>
                {isEditingProject && (
                  <button 
                    onClick={() => {
                      setIsEditingProject(false);
                      setCurrentProject({ title: "", description: "", technologies: "", url: "", githubUrl: "", imageUrl: "" });
                      setProjectImageFile(null);
                      setProjectMessage("");
                    }}
                    className="text-xs font-bold text-orange hover:underline"
                  >
                    Switch to Add New
                  </button>
                )}
              </div>
              <form onSubmit={saveProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Project Title</label>
                  <input required type="text" value={currentProject.title} onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Description</label>
                  <textarea required rows={3} value={currentProject.description} onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Technologies (comma separated)</label>
                  <input type="text" value={currentProject.technologies} onChange={(e) => setCurrentProject({ ...currentProject, technologies: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Deployed URL</label>
                  <input type="url" value={currentProject.url} onChange={(e) => setCurrentProject({ ...currentProject, url: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">GitHub Repository URL</label>
                  <input type="url" value={currentProject.githubUrl} onChange={(e) => setCurrentProject({ ...currentProject, githubUrl: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-800" />
                </div>

                
                {/* Project Image Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Project Screenshot {isEditingProject && currentProject.imageUrl ? "(leave blank to keep current)" : ""}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-orange transition-colors">
                    <input
                      ref={projectImageRef}
                      type="file"
                      id="projectImageFile"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setProjectImageFile(e.target.files?.[0] || null)}
                    />
                    <label htmlFor="projectImageFile" className="cursor-pointer flex flex-col items-center">
                      <ImagePlus size={28} className="text-gray-400 mb-2" />
                      <span className="text-gray-700 font-medium text-sm">
                        {projectImageFile ? projectImageFile.name : "Click to select image"}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</span>
                    </label>
                  </div>
                  {isEditingProject && currentProject.imageUrl && !projectImageFile && (
                    <div className="mt-3 relative w-full h-32 rounded-xl overflow-hidden border border-gray-200">
                      <Image src={currentProject.imageUrl} alt="Current" fill className="object-contain" />
                    </div>
                  )}
                </div>

                {projectMessage && (
                  <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                    projectMessage.includes("success") || projectMessage.includes("updated") || projectMessage.includes("deleted") 
                      ? "bg-green-50 text-green-600 border border-green-200" 
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}>
                    {projectMessage.includes("success") || projectMessage.includes("updated") || projectMessage.includes("deleted") ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {projectMessage}
                  </div>
                )}

                <div className="flex space-x-3 pt-2">
                  <button type="submit" disabled={uploadingProjectImage} className="flex-1 py-3 bg-orange text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50">
                    {uploadingProjectImage ? "Saving..." : isEditingProject ? "Update Project" : "Add Project"}
                  </button>
                  {isEditingProject && (
                    <button type="button" onClick={() => { setIsEditingProject(false); setCurrentProject({ title: "", description: "", technologies: "", url: "", githubUrl: "", imageUrl: "" }); setProjectImageFile(null); if (projectImageRef.current) projectImageRef.current.value = ""; }} className="px-4 py-3 bg-gray-300 text-gray-700 font-bold rounded-xl">

                      Cancel
                    </button>
                  )}
                </div>

              </form>
            </div>
            <div className="lg:col-span-7 space-y-4">

              <h3 className="text-xl font-bold text-navy mb-6">Existing Projects</h3>
              {projects.map(proj => (
                <div key={proj._id} className="bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white/50 flex items-center gap-5 group hover:bg-white hover:shadow-lg transition-all duration-300">
                  {/* Thumbnail */}
                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-navy/5 flex-shrink-0 flex items-center justify-center border border-gray-200 relative">
                    {proj.imageUrl ? (
                      <Image src={proj.imageUrl} alt={proj.title} fill className="object-cover" />
                    ) : (
                      <Briefcase size={24} className="text-gray-300" />
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-navy">{proj.title}</h4>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{proj.description}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button onClick={() => editProject(proj)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                    <button onClick={() => deleteProject(proj._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <p className="text-gray-500 text-sm">No projects added yet.</p>}
            </div>
          </div>
        )}

        {/* ── Certificates Tab ── */}
        {activeTab === "certificates" && (
          <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Form */}
            <div className="lg:col-span-5 bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-navy/5 border border-white/50 h-fit">

              <h3 className="text-xl font-bold text-navy mb-6">
                {editingCert ? "Edit Certificate" : "Add Certificate"}
              </h3>
              <form onSubmit={saveCertificate} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Certificate Title</label>
                  <input
                    required
                    type="text"
                    value={certForm.title}
                    onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                    placeholder="e.g. Startup Innovation Founder"
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Issued By</label>
                  <input
                    required
                    type="text"
                    value={certForm.org}
                    onChange={(e) => setCertForm({ ...certForm, org: e.target.value })}
                    placeholder="e.g. Ministry of Innovation & Tech"
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-800"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Certificate Image {editingCert?.imageUrl ? "(leave blank to keep current)" : ""}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-orange transition-colors">
                    <input
                      ref={certImageRef}
                      type="file"
                      id="certImageFile"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setCertImageFile(e.target.files?.[0] || null)}
                    />
                    <label htmlFor="certImageFile" className="cursor-pointer flex flex-col items-center">
                      <ImagePlus size={28} className="text-gray-400 mb-2" />
                      <span className="text-gray-700 font-medium text-sm">
                        {certImageFile ? certImageFile.name : "Click to select image"}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</span>
                    </label>
                  </div>
                  {/* Preview current image if editing */}
                  {editingCert?.imageUrl && !certImageFile && (
                    <div className="mt-3 relative w-full h-32 rounded-xl overflow-hidden border border-gray-200">
                      <Image src={editingCert.imageUrl} alt="Current" fill className="object-contain" />
                    </div>
                  )}
                </div>

                {certMessage && (
                  <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${certMessage.includes("fail") || certMessage.includes("fail") ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-600 border border-green-200"}`}>
                    {certMessage.includes("fail") ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    {certMessage}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={uploadingCertImage}
                    className="flex-1 py-3 bg-navy text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {uploadingCertImage ? "Uploading image..." : editingCert ? "Update Certificate" : "Add Certificate"}
                  </button>
                  {editingCert && (
                    <button
                      type="button"
                      onClick={() => { setEditingCert(null); setCertForm({ title: "", org: "" }); setCertImageFile(null); setCertMessage(""); if (certImageRef.current) certImageRef.current.value = ""; }}
                      className="px-4 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Certificate List */}
            <div className="lg:col-span-7 space-y-4">

              <h3 className="text-xl font-bold text-navy mb-2">Saved Certificates</h3>
              <p className="text-sm text-gray-500 mb-4">Certificates with an image will be clickable on the portfolio.</p>
              {certificates.map((cert) => (
                <div key={cert._id} className="bg-white/60 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-white/50 flex items-center gap-5 group hover:bg-white hover:shadow-lg transition-all duration-300">

                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-navy/5 flex-shrink-0 flex items-center justify-center border border-gray-200">
                    {cert.imageUrl ? (
                      <div className="relative w-full h-full">
                        <Image src={cert.imageUrl} alt={cert.title} fill className="object-cover" />
                      </div>
                    ) : (
                      <Award size={24} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-navy truncate">{cert.title}</h4>
                    <p className="text-sm text-gray-500">{cert.org}</p>
                    <span className={`text-xs font-medium mt-1 inline-block ${cert.imageUrl ? "text-green-600" : "text-gray-400"}`}>
                      {cert.imageUrl ? "✓ Has image" : "No image yet"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditCert(cert)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => deleteCertificate(cert._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {certificates.length === 0 && (
                <p className="text-gray-400 text-sm py-8 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                  No certificates yet. Add one using the form.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── CV Tab ── */}
        {activeTab === "cv" && (
          <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] shadow-xl shadow-navy/5 border border-white/50 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-500">

            <h3 className="text-xl font-bold text-navy mb-2">Upload New CV</h3>
            <p className="text-gray-500 text-sm mb-6">Upload a PDF file. This will replace the file shown when users click "Preview CV".</p>
            <form onSubmit={uploadCv} className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange transition-colors">
                <input
                  type="file"
                  id="cvFile"
                  className="hidden"
                  accept=".pdf,application/pdf"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="cvFile" className="cursor-pointer flex flex-col items-center">
                  <Upload size={32} className="text-gray-400 mb-3" />
                  <span className="text-gray-700 font-medium">Click to select PDF file</span>
                  <span className="text-sm text-gray-400 mt-1">{cvFile ? cvFile.name : "PDF files only"}</span>
                </label>
              </div>
              {uploadMessage && (
                <div className={`p-4 rounded-lg text-sm font-medium flex items-center space-x-2 ${uploadMessage.includes("success") ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-500 border border-red-200"}`}>
                  {uploadMessage.includes("success") ? <CheckCircle size={18} /> : <XCircle size={18} />}
                  <span>{uploadMessage}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={!cvFile || uploadingCv}
                className={`w-full py-3 bg-navy text-white font-bold rounded-xl hover:opacity-90 transition-all flex justify-center items-center space-x-2 ${(!cvFile || uploadingCv) ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span>{uploadingCv ? "Uploading..." : "Upload & Update CV"}</span>
              </button>
            </form>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

