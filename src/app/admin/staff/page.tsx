"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Upload, Trash, Check, AlertCircle, Award, Edit, X } from "lucide-react";

// ==========================================
// 100% BUILD-SAFE INLINE SVG BRAND ICONS
// ==========================================
const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const WhatsappIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6-.95 2.535-1.488 4.135-.5l.317.188c1.606.953 3.39 1.455 5.213 1.456 5.485 0 9.95-4.414 9.954-9.84.002-2.628-1.02-5.1-2.878-6.96C21.49 2.13 19.03 1.1 16.425 1.1 11.002 1.1 6.593 5.511 6.59 10.939c-.001 1.79.467 3.533 1.356 5.068l-.193-.338-.992 3.626 3.842-.941z"/>
  </svg>
);

export default function StaffManagement() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States (Create)
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [bio, setBio] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [photo, setPhoto] = useState<{ url: string; publicId: string } | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Edit Modal States
  const [editingStaff, setEditingStaff] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editSortOrder, setEditSortOrder] = useState(0);
  const [editFeatured, setEditFeatured] = useState(false);
  const [editActive, setEditActive] = useState(true);
  const [editFacebook, setEditFacebook] = useState("");
  const [editInstagram, setEditInstagram] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editWhatsapp, setEditWhatsapp] = useState("");
  const [editPhoto, setEditPhoto] = useState<{ url: string; publicId: string } | null>(null);
  const [updating, setUpdating] = useState(false);

  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      if (data.success) {
        setTeam(data.data);
      }
    } catch (err) {
      console.error("Failed to load staff", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const showNotification = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const uploadStaffPhoto = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "staff");
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    return await res.json();
  };

  // Photo Upload Handler (Create)
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const data = await uploadStaffPhoto(file);
      if (data.success) {
        setPhoto({ url: data.url, publicId: data.publicId });
        showNotification("Profile photo uploaded!", "success");
      }
    } catch (err) {
      showNotification("Photo upload failed", "error");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Submit Staff Form (Create)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !position || !photo) {
      showNotification("Please fill name, position and upload a photo.", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          position,
          bio,
          photo,
          sortOrder,
          isFeatured,
          isActive,
          socialLinks: { facebook, instagram, linkedin, whatsapp }
        })
      });

      const data = await res.json();
      if (data.success) {
        showNotification("Staff member added successfully!", "success");
        setName(""); setPosition(""); setBio(""); setSortOrder(0);
        setIsFeatured(false); setIsActive(true);
        setFacebook(""); setInstagram(""); setLinkedin(""); setWhatsapp("");
        setPhoto(null);
        fetchStaff();
      }
    } catch (err) {
      showNotification("Failed to add staff member", "error");
    }
  };

  // Delete Staff Member
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    try {
      const res = await fetch(`/api/admin/staff/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showNotification("Staff member deleted successfully!", "success");
        fetchStaff();
      }
    } catch (err) {
      showNotification("Failed to delete staff member", "error");
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (member: any) => {
    setEditingStaff(member);
    setEditName(member.name);
    setEditPosition(member.position);
    setEditBio(member.bio || "");
    setEditSortOrder(member.sortOrder || 0);
    setEditFeatured(member.isFeatured || false);
    setEditActive(member.isActive !== undefined ? member.isActive : true);
    setEditFacebook(member.socialLinks?.facebook || "");
    setEditInstagram(member.socialLinks?.instagram || "");
    setEditLinkedin(member.socialLinks?.linkedin || "");
    setEditWhatsapp(member.socialLinks?.whatsapp || "");
    setEditPhoto(member.photo);
  };

  // Submit Update Staff (PUT)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/staff/${editingStaff._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          position: editPosition,
          bio: editBio,
          sortOrder: editSortOrder,
          isFeatured: editFeatured,
          isActive: editActive,
          photo: editPhoto,
          socialLinks: {
            facebook: editFacebook,
            instagram: editInstagram,
            linkedin: editLinkedin,
            whatsapp: editWhatsapp
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        showNotification("Staff member updated successfully!", "success");
        setEditingStaff(null);
        fetchStaff();
      } else {
        showNotification(data.message || "Update failed", "error");
      }
    } catch (err) {
      showNotification("Failed to update staff member", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lenux-emerald"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-lenux-deep">Team / Staff Management</h1>
        <p className="text-lenux-darkGray mt-1">Manage the creative minds behind Lenux Production.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"
        }`}>
          {message.type === "success" ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: STAFF LIST */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-lenux-deep mb-6">Current Team Members ({team.length})</h3>
          
          {team.length === 0 ? (
            <p className="text-gray-400 text-sm">No staff members added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {team.map((member) => (
                <div key={member._id} className="border border-gray-100 rounded-2xl p-5 flex gap-4 hover:shadow-md transition-all relative">
                  
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                    <Image src={member.photo.url} alt={member.name} fill className="object-cover" sizes="80px" />
                  </div>

                  <div className="space-y-1.5 flex-1 pr-12">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-lenux-charcoal text-base">{member.name}</h4>
                      <div className="flex gap-1">
                        {member.isFeatured && (
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full uppercase">Featured</span>
                        )}
                        {!member.isActive && (
                          <span className="text-[9px] font-bold bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-full uppercase">Hidden</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-lenux-emerald flex items-center gap-1">
                      <Award size={14} /> {member.position}
                    </p>
                    {member.bio && (
                      <p className="text-xs text-lenux-darkGray line-clamp-2 leading-relaxed">{member.bio}</p>
                    )}

                    <div className="flex gap-2 pt-2 text-gray-400">
                      {member.socialLinks?.facebook && <FacebookIcon className="w-4 h-4 text-blue-600" />}
                      {member.socialLinks?.instagram && <InstagramIcon className="w-4 h-4 text-pink-600" />}
                      {member.socialLinks?.linkedin && <LinkedinIcon className="w-4 h-4 text-blue-700" />}
                      {member.socialLinks?.whatsapp && <WhatsappIcon className="w-4 h-4 text-emerald-600" />}
                    </div>
                  </div>

                  {/* Edit & Delete Buttons */}
                  <div className="absolute bottom-4 right-4 flex gap-1">
                    <button onClick={() => handleOpenEdit(member)} className="text-blue-500 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(member._id)} className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ADD STAFF FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-lg font-bold text-lenux-deep">Add New Staff</h3>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Full Name</label>
              <input type="text" required className="admin-input" placeholder="e.g., Hathisa Thissara" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Position / Title</label>
              <input type="text" required className="admin-input" placeholder="e.g., Creative Designer" value={position} onChange={(e) => setPosition(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Display Order</label>
                <input type="number" className="admin-input" placeholder="0" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
              </div>
              <div className="flex flex-col justify-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-lenux-charcoal font-medium">
                  <input type="checkbox" className="rounded text-lenux-emerald focus:ring-lenux-emerald" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                  Feature on Home
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Brief Bio</label>
              <textarea rows={2} className="admin-input" placeholder="Brief intro..." value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Profile Photo</label>
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all">
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePhotoUpload} />
                {photo ? (
                  <div className="text-center relative w-16 h-16">
                    <Image src={photo.url} alt="Profile preview" fill className="object-cover rounded-full" />
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Upload size={20} className="mx-auto mb-1" />
                    <span className="text-[11px]">{uploadingPhoto ? "Uploading..." : "Upload Professional Photo"}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              <span className="block text-xs font-bold text-lenux-deep uppercase">Social Profiles (Optional)</span>
              
              <div className="flex gap-2">
                <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg text-blue-600 flex items-center shrink-0">
                  <FacebookIcon className="w-4 h-4" />
                </div>
                <input type="url" className="admin-input py-1 text-sm" placeholder="Facebook profile URL" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
              </div>

              <div className="flex gap-2">
                <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg text-pink-600 flex items-center shrink-0">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                <input type="url" className="admin-input py-1 text-sm" placeholder="Instagram profile URL" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
              </div>

              <div className="flex gap-2">
                <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg text-blue-700 flex items-center shrink-0">
                  <LinkedinIcon className="w-4 h-4" />
                </div>
                <input type="url" className="admin-input py-1 text-sm" placeholder="LinkedIn profile URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
              </div>

              <div className="flex gap-2">
                <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg text-emerald-600 flex items-center shrink-0">
                  <WhatsappIcon className="w-4 h-4" />
                </div>
                <input type="text" className="admin-input py-1 text-sm" placeholder="WhatsApp Number" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full gap-2 text-sm mt-4">
              <Plus size={16} /> Save Staff Member
            </button>
          </form>
        </div>

      </div>

      {/* ==========================================
          🌟 EDIT STAFF MODAL
          ========================================== */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col justify-between">
            
            <div className="p-6 bg-lenux-deep text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">Edit Staff Member</h3>
              <button onClick={() => setEditingStaff(null)} className="text-white/80 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Full Name</label>
                <input type="text" required className="admin-input" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Position / Title</label>
                <input type="text" required className="admin-input" value={editPosition} onChange={(e) => setEditPosition(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Display Order</label>
                  <input type="number" className="admin-input" value={editSortOrder} onChange={(e) => setEditSortOrder(Number(e.target.value))} />
                </div>
                <div className="flex flex-col justify-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-lenux-charcoal font-medium">
                    <input type="checkbox" className="rounded text-lenux-emerald focus:ring-lenux-emerald" checked={editFeatured} onChange={(e) => setEditFeatured(e.target.checked)} />
                    Feature on Home
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Brief Bio</label>
                <textarea rows={2} className="admin-input" value={editBio} onChange={(e) => setEditBio(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Profile Photo</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if(file) {
                      const data = await	uploadStaffPhoto(file);
                      if(data.success) setEditPhoto({ url: data.url, publicId: data.publicId });
                    }
                  }} />
                  {editPhoto?.url ? (
                    <div className="text-center relative w-16 h-16">
                      <Image src={editPhoto.url} alt="Edit preview" fill className="object-cover rounded-full" />
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Upload new photo</span>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <span className="block text-xs font-bold text-lenux-deep uppercase">Social Profiles</span>
                <input type="url" className="admin-input py-1 text-sm" placeholder="Facebook URL" value={editFacebook} onChange={(e) => setEditFacebook(e.target.value)} />
                <input type="url" className="admin-input py-1 text-sm" placeholder="Instagram URL" value={editInstagram} onChange={(e) => setEditInstagram(e.target.value)} />
                <input type="url" className="admin-input py-1 text-sm" placeholder="LinkedIn URL" value={editLinkedin} onChange={(e) => setEditLinkedin(e.target.value)} />
                <input type="text" className="admin-input py-1 text-sm" placeholder="WhatsApp Number" value={editWhatsapp} onChange={(e) => setEditWhatsapp(e.target.value)} />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setEditingStaff(null)} className="px-5 py-2.5 border rounded-xl text-sm text-gray-600">Cancel</button>
                <button type="submit" disabled={updating} className="btn-primary text-sm px-6">{updating ? "Updating..." : "Save Changes"}</button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}