"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, AlertCircle, Building, Phone, Globe, MapPin, Upload } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState<"company" | "contact" | "socials">("company");

  // Input States
  const [companyName, setCompanyName] = useState("");
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  
  const [phone, setPhone] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  
  const [googleMapUrl, setGoogleMapUrl] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // Image States
  const [logo, setLogo] = useState<{ url: string; publicId: string } | null>(null);
  const [visionImage, setVisionImage] = useState<{ url: string; publicId: string } | null>(null);
  const [missionImage, setMissionImage] = useState<{ url: string; publicId: string } | null>(null);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingVision, setUploadingVision] = useState(false);
  const [uploadingMission, setUploadingMission] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.data) {
        const s = data.data;
        setCompanyName(s.companyName || "");
        setVision(s.vision || "");
        setMission(s.mission || "");
        setPhone(s.phone || "");
        setSecondaryPhone(s.secondaryPhone || "");
        setWhatsapp(s.whatsapp || "");
        setEmail(s.email || "");
        setAddress(s.address || "");
        setBusinessHours(s.businessHours || "");
        setGoogleMapUrl(s.googleMapUrl || "");
        setFacebook(s.facebook || "");
        setInstagram(s.instagram || "");
        setLinkedin(s.linkedin || "");

        setLogo(s.logo || null);
        setVisionImage(s.visionImage || null);
        setMissionImage(s.missionImage || null);
      }
    } catch (err) {
      console.error("Failed to fetch settings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const showNotification = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "vision" | "mission") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "logo") setUploadingLogo(true);
    else if (type === "vision") setUploadingVision(true);
    else setUploadingMission(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "settings");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        const imgObj = { url: data.url, publicId: data.publicId };
        if (type === "logo") setLogo(imgObj);
        else if (type === "vision") setVisionImage(imgObj);
        else setMissionImage(imgObj);

        showNotification("Image uploaded to Cloud! Click 'Save Settings' below to save permanently.", "success");
      }
    } catch (err) {
      showNotification("Upload failed", "error");
    } finally {
      setUploadingLogo(false);
      setUploadingVision(false);
      setUploadingMission(false);
    }
  };

  // Save All Settings
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        companyName,
        vision,
        mission,
        phone,
        secondaryPhone,
        whatsapp,
        email,
        address,
        businessHours,
        googleMapUrl,
        facebook,
        instagram,
        linkedin,
        logo,
        visionImage,
        missionImage
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        showNotification("All settings, texts & images saved to Database successfully!", "success");
        fetchSettings(); // Refresh with database values
      } else {
        showNotification(data.message || "Failed to update settings", "error");
      }
    } catch (err) {
      showNotification("Something went wrong while saving", "error");
    } finally {
      setSaving(false);
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
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-lenux-deep">Website Settings</h1>
        <p className="text-lenux-darkGray mt-1">Manage global content, contact details, map location, logos and images.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row bg-gray-200 p-1 rounded-xl w-full sm:w-fit gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("company")}
          className={`flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "company" ? "bg-white text-lenux-deep shadow" : "text-lenux-darkGray hover:text-lenux-deep"
          }`}
        >
          <Building size={16} /> Company Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          className={`flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "contact" ? "bg-white text-lenux-deep shadow" : "text-lenux-darkGray hover:text-lenux-deep"
          }`}
        >
          <Phone size={16} /> Contact Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("socials")}
          className={`flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "socials" ? "bg-white text-lenux-deep shadow" : "text-lenux-darkGray hover:text-lenux-deep"
          }`}
        >
          <Globe size={16} /> Map & Socials
        </button>
      </div>

      {/* Notifications */}
      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"
        }`}>
          {message.type === "success" ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        
        {/* TAB 1: COMPANY PROFILE */}
        {activeTab === "company" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-lenux-deep border-b border-gray-100 pb-2">Logo & Brand Profile</h3>
            
            {/* Logo Upload */}
            <div className="bg-lenux-soft/10 p-5 rounded-2xl border border-lenux-soft/30 flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-24 h-24 bg-white rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                {logo?.url ? (
                  <Image src={logo.url} alt="Company Logo" fill className="object-contain p-2" />
                ) : (
                  <span className="text-xs text-gray-400">No Logo</span>
                )}
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h4 className="font-bold text-lenux-charcoal text-sm">Company Brand Logo</h4>
                <p className="text-xs text-lenux-darkGray">This logo appears on header, footer, and as the browser title icon.</p>
                <div className="relative inline-block">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, "logo")} />
                  <button type="button" className="btn-secondary py-1.5 px-4 text-xs gap-1.5 inline-flex items-center">
                    <Upload size={14} /> {uploadingLogo ? "Uploading..." : "Upload Logo"}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Company Name</label>
              <input type="text" required className="admin-input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>

            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vision */}
              <div className="space-y-4">
                <h4 className="font-bold text-lenux-deep text-sm">Vision (දැක්ම) Section</h4>
                <div>
                  <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Our Vision Text</label>
                  <textarea rows={4} className="admin-input py-2" placeholder="To become Sri Lanka's leading..." value={vision} onChange={(e) => setVision(e.target.value)} />
                </div>
                
                {/* Vision Image */}
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all bg-gray-50/50">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, "vision")} />
                  {visionImage?.url ? (
                    <div className="text-center relative w-full h-24">
                      <Image src={visionImage.url} alt="Vision preview" fill className="object-cover rounded-lg" />
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <Upload size={20} className="mx-auto mb-1" />
                      <span className="text-xs">{uploadingVision ? "Uploading..." : "Upload Vision Image"}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Mission */}
              <div className="space-y-4">
                <h4 className="font-bold text-lenux-deep text-sm">Mission (මෙහෙවර) Section</h4>
                <div>
                  <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Our Mission Text</label>
                  <textarea rows={4} className="admin-input py-2" placeholder="To provide fair, fast..." value={mission} onChange={(e) => setMission(e.target.value)} />
                </div>

                {/* Mission Image */}
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-lenux-emerald cursor-pointer transition-all bg-gray-50/50">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, "mission")} />
                  {missionImage?.url ? (
                    <div className="text-center relative w-full h-24">
                      <Image src={missionImage.url} alt="Mission preview" fill className="object-cover rounded-lg" />
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <Upload size={20} className="mx-auto mb-1" />
                      <span className="text-xs">{uploadingMission ? "Uploading..." : "Upload Mission Image"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTACT DETAILS */}
        {activeTab === "contact" && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-lenux-deep border-b border-gray-100 pb-2">Contact Details & Business Hours</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Primary Phone</label>
                <input type="text" required className="admin-input" placeholder="+94 77 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Secondary Phone</label>
                <input type="text" className="admin-input" placeholder="+94 11 123 4567" value={secondaryPhone} onChange={(e) => setSecondaryPhone(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">WhatsApp Number</label>
                <input type="text" className="admin-input" placeholder="+94 77 123 4567" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Email Address</label>
                <input type="email" required className="admin-input" placeholder="info@lenux.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Physical Address</label>
              <input type="text" required className="admin-input" placeholder="No. 123, Galle Road, Colombo" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Business Hours</label>
              <input type="text" className="admin-input" placeholder="Monday - Saturday: 8:30 AM - 5:30 PM" value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} />
            </div>
          </div>
        )}

        {/* TAB 3: MAPS & SOCIALS */}
        {activeTab === "socials" && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-lenux-deep border-b border-gray-100 pb-2">Map Location & Social Media</h3>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1 flex items-center gap-1"><MapPin size={14} /> Google Map Iframe / Share Link</label>
              <input type="url" className="admin-input" placeholder="https://www.google.com/maps/embed?pb=..." value={googleMapUrl} onChange={(e) => setGoogleMapUrl(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-50 pt-4">
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Facebook URL</label>
                <input type="url" className="admin-input text-sm" placeholder="https://facebook.com/lenux" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Instagram URL</label>
                <input type="url" className="admin-input text-sm" placeholder="https://instagram.com/lenux" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">LinkedIn URL</label>
                <input type="url" className="admin-input text-sm" placeholder="https://linkedin.com/company/lenux" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2 text-sm px-8"
          >
            {saving ? "Saving to Database..." : "Save Settings"}
          </button>
        </div>

      </form>
    </div>
  );
}