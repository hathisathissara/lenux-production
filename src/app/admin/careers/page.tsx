"use client";

import { useEffect, useState } from "react";
import { Plus, Trash, Check, AlertCircle, Briefcase, MapPin, Edit, X, Clock } from "lucide-react";

interface IJob {
  _id: string;
  title: string;
  department: string;
  jobType: string;
  location: string;
  description: string;
  requirements: string;
  salary: string;
  deadline?: string;
  isActive: boolean;
}

export default function AdminCareersPage() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States (Create)
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Production");
  const [jobType, setJobType] = useState("Full-Time");
  const [location, setLocation] = useState("Colombo");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("Negotiable");
  const [deadline, setDeadline] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder] = useState(0);

  // Edit Modal States
  const [editingJob, setEditingJob] = useState<IJob | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDept, setEditDept] = useState("");
  const [editType, setEditType] = useState("");
  const [editLoc, setEditLoc] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editReq, setEditReq] = useState("");
  const [editSalary, setEditSalary] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/admin/careers");
      const data = await res.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => { await fetchJobs(); };
    void load();
  }, []);

  const showNotification = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // Submit Create Job
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !department || !description || !requirements) {
      showNotification("Please fill all required fields.", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          department,
          jobType,
          location,
          description,
          requirements,
          salary,
          deadline: deadline || undefined,
          isActive,
          sortOrder,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification("Job vacancy posted successfully!", "success");
        setTitle(""); setDescription(""); setRequirements(""); setDeadline("");
        fetchJobs();
      }
    } catch {
      showNotification("Failed to post job vacancy", "error");
    }
  };

  // Delete Job
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job vacancy?")) return;

    try {
      const res = await fetch(`/api/admin/careers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showNotification("Job vacancy deleted!", "success");
        fetchJobs();
      }
    } catch {
      showNotification("Failed to delete", "error");
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (job: IJob) => {
    setEditingJob(job);
    setEditTitle(job.title);
    setEditDept(job.department);
    setEditType(job.jobType);
    setEditLoc(job.location);
    setEditDesc(job.description);
    setEditReq(job.requirements);
    setEditSalary(job.salary || "Negotiable");
    setEditDeadline(job.deadline ? job.deadline.substring(0, 10) : "");
    setEditActive(job.isActive);
  };

  // Submit Update (PUT)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/careers/${editingJob._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          department: editDept,
          jobType: editType,
          location: editLoc,
          description: editDesc,
          requirements: editReq,
          salary: editSalary,
          deadline: editDeadline ? new Date(editDeadline) : undefined,
          isActive: editActive,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification("Job vacancy updated successfully!", "success");
        setEditingJob(null);
        fetchJobs();
      }
    } catch {
      showNotification("Update failed", "error");
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
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-bold text-lenux-deep">Careers Management</h1>
        <p className="text-lenux-darkGray mt-1">Post and manage job vacancies for Lenux Production.</p>
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
        
        {/* LEFT: JOB VACANCIES LIST */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-lenux-deep mb-6">Current Vacancies ({jobs.length})</h3>

          {jobs.length === 0 ? (
            <p className="text-gray-400 text-sm">No job vacancies created yet.</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-lenux-charcoal text-base">{job.title}</h4>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        job.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-700"
                      }`}>
                        {job.isActive ? "Active" : "Closed"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Briefcase size={13} className="text-lenux-emerald" /> {job.department}</span>
                      <span className="flex items-center gap-1"><Clock size={13} /> {job.jobType}</span>
                      <span className="flex items-center gap-1"><MapPin size={13} /> {job.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button onClick={() => handleOpenEdit(job)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit Vacancy">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(job._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete Vacancy">
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: CREATE VACANCY FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-bold text-lenux-deep">Post New Vacancy</h3>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Job Title *</label>
              <input type="text" required className="admin-input text-sm" placeholder="e.g., Graphic Designer (2D/3D)" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Department *</label>
                <select className="admin-input text-sm" value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="Design">Design</option>
                  <option value="Printing">Printing</option>
                  <option value="Production">Production</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Job Type</label>
                <select className="admin-input text-sm" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Remote">Remote</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Location</label>
                <input type="text" className="admin-input text-sm" placeholder="e.g., Colombo" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Salary Spec</label>
                <input type="text" className="admin-input text-sm" placeholder="e.g., Negotiable" value={salary} onChange={(e) => setSalary(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Job Description *</label>
              <textarea rows={3} required className="admin-input text-sm" placeholder="What are the main responsibilities..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Requirements / Qualifications *</label>
              <textarea rows={3} required className="admin-input text-sm" placeholder="Experience in Photoshop/Illustrator, 2+ years..." value={requirements} onChange={(e) => setRequirements(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-lenux-darkGray uppercase mb-1">Deadline (Optional)</label>
                <input type="date" className="admin-input text-sm" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>
              <div className="flex items-center mt-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <input type="checkbox" className="rounded text-lenux-emerald" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                  Publish Live
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full gap-2 text-sm mt-2">
              <Plus size={16} /> Post Job Vacancy
            </button>
          </form>
        </div>

      </div>

      {/* EDIT MODAL */}
      {editingJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-lenux-deep">Edit Job Vacancy</h3>
              <button onClick={() => setEditingJob(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Job Title</label>
                <input type="text" required className="admin-input text-sm" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Department</label>
                  <select className="admin-input text-sm" value={editDept} onChange={(e) => setEditDept(e.target.value)}>
                    <option value="Design">Design</option>
                    <option value="Printing">Printing</option>
                    <option value="Production">Production</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Job Type</label>
                  <select className="admin-input text-sm" value={editType} onChange={(e) => setEditType(e.target.value)}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Remote">Remote</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Description</label>
                <textarea rows={3} required className="admin-input text-sm" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Requirements</label>
                <textarea rows={3} required className="admin-input text-sm" value={editReq} onChange={(e) => setEditReq(e.target.value)} />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <input type="checkbox" className="rounded text-lenux-emerald" checked={editActive} onChange={(e) => setEditActive(e.target.checked)} />
                  Active on Website
                </label>

                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditingJob(null)} className="px-4 py-2 border rounded-xl text-sm">Cancel</button>
                  <button type="submit" disabled={updating} className="btn-primary text-sm px-5">{updating ? "Saving..." : "Save"}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}