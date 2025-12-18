import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/client";
import { useAuth } from "../../context/authContext";

/* ================= ANIMATION ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalContent = {
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25 } },
};

/* ================= HELPERS ================= */
const toNumberOrNull = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const parseFeatures = (text) => {
  // fitur per baris, ignore kosong
  return String(text || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
};

const featuresToText = (arr) => (Array.isArray(arr) ? arr.join("\n") : "");

/* ================= UI COMPONENTS ================= */
const PillButton = ({ className = "", ...props }) => (
  <button
    {...props}
    className={
      "px-4 py-2 rounded-lg text-sm font-bold transition " +
      "border border-zinc-700 bg-zinc-800/50 text-white hover:border-gym-green hover:text-gym-green " +
      className
    }
  />
);

const DangerButton = ({ className = "", ...props }) => (
  <button
    {...props}
    className={
      "px-3 py-1.5 rounded text-xs font-bold transition " +
      "bg-red-900/30 text-red-300 hover:bg-red-900/50 " +
      className
    }
  />
);

const PrimaryButton = ({ className = "", ...props }) => (
  <button
    {...props}
    className={
      "px-4 py-2 rounded-lg text-sm font-black transition " +
      "bg-gym-green text-black hover:opacity-90 " +
      className
    }
  />
);

const Input = ({ label, ...props }) => (
  <label className="block">
    <span className="block text-xs font-bold text-gray-400 mb-2">{label}</span>
    <input
      {...props}
      className={
        "w-full rounded-lg bg-zinc-800/60 border border-zinc-700 px-3 py-2 " +
        "text-white outline-none focus:border-gym-green"
      }
    />
  </label>
);

const TextArea = ({ label, ...props }) => (
  <label className="block">
    <span className="block text-xs font-bold text-gray-400 mb-2">{label}</span>
    <textarea
      {...props}
      className={
        "w-full rounded-lg bg-zinc-800/60 border border-zinc-700 px-3 py-2 " +
        "text-white outline-none focus:border-gym-green min-h-[110px]"
      }
    />
  </label>
);

const ModalShell = ({ open, title, onClose, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          variants={modalBackdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onMouseDown={(e) => {
            // click outside to close
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            variants={modalContent}
            className="w-full max-w-xl rounded-2xl bg-zinc-900 border border-zinc-700 p-6"
          >
            <div className="flex items-center justify-between gap-3 mb-5">
              <h3 className="text-xl font-black text-white">{title}</h3>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ================= PAGE ================= */
export default function AdminDashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [plans, setPlans] = useState([]);

  const [error, setError] = useState("");

  // modals
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [classModalOpen, setClassModalOpen] = useState(false);

  // edit state
  const [editingPlan, setEditingPlan] = useState(null); // object or null
  const [editingClass, setEditingClass] = useState(null);

  // forms
  const [planForm, setPlanForm] = useState({
    name: "",
    description: "",
    price: "",
    duration_days: "",
    featuresText: "",
  });

  const [classForm, setClassForm] = useState({
    name: "",
    short_description: "",
    description: "",
    image_url: "",
    schedule: "",
    capacity: "",
    trainer_id: "",
  });

  /* ================= FETCH ================= */
  const loadAll = async () => {
    setError("");
    setLoading(true);
    try {
      const [usersRes, classesRes, plansRes] = await Promise.all([
        api.get("/api/admin/users"),
        api.get("/api/classes"),
        api.get("/api/memberships"),
      ]);

      setUsers(usersRes.data || []);
      setClasses(classesRes.data?.data || []);
      setPlans(plansRes.data?.data || []);
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
      setError(err?.response?.data?.error || err?.message || "Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* ================= CRUD: MEMBERSHIP ================= */
  const openCreatePlan = () => {
    setEditingPlan(null);
    setPlanForm({
      name: "",
      description: "",
      price: "",
      duration_days: "",
      featuresText: "",
    });
    setPlanModalOpen(true);
  };

  const openEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name || "",
      description: plan.description || "",
      price: String(plan.price ?? ""),
      duration_days: String(plan.duration_days ?? ""),
      featuresText: featuresToText(plan.features || []),
    });
    setPlanModalOpen(true);
  };

  const savePlan = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      name: planForm.name.trim(),
      description: planForm.description?.trim() || null,
      price: toNumberOrNull(planForm.price),
      duration_days: toNumberOrNull(planForm.duration_days),
      features: parseFeatures(planForm.featuresText),
    };

    if (!payload.name || payload.price == null || payload.duration_days == null) {
      setError("Plan: name, price, duration_days wajib diisi.");
      return;
    }

    try {
      if (editingPlan) {
        const res = await api.put(`/api/memberships/${editingPlan.id}`, payload);
        const updated = res.data?.data;
        setPlans((prev) => prev.map((p) => (p.id === editingPlan.id ? updated : p)));
      } else {
        const res = await api.post(`/api/memberships`, payload);
        const created = res.data?.data;
        setPlans((prev) => [created, ...prev]);
      }
      setPlanModalOpen(false);
      setEditingPlan(null);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || "Save plan failed");
    }
  };

  const deletePlan = async (id) => {
    if (!confirm("Delete this membership plan?")) return;
    setError("");
    try {
      await api.delete(`/api/memberships/${id}`);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err?.response?.data?.error || "Delete plan failed");
    }
  };

  /* ================= CRUD: CLASSES ================= */
  const openCreateClass = () => {
    setEditingClass(null);
    setClassForm({
      name: "",
      short_description: "",
      description: "",
      image_url: "",
      schedule: "",
      capacity: "",
      trainer_id: "",
    });
    setClassModalOpen(true);
  };

  const openEditClass = (cls) => {
    setEditingClass(cls);
    setClassForm({
      name: cls.name || "",
      short_description: cls.short_description || "",
      description: cls.description || "",
      image_url: cls.image_url || "",
      schedule: cls.schedule || "",
      capacity: String(cls.capacity ?? ""),
      trainer_id: String(cls.trainer_id ?? ""),
    });
    setClassModalOpen(true);
  };

  const saveClass = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      name: classForm.name.trim(),
      short_description: classForm.short_description?.trim() || null,
      description: classForm.description?.trim() || null,
      image_url: classForm.image_url?.trim() || null,
      schedule: classForm.schedule.trim(),
      capacity: toNumberOrNull(classForm.capacity),
      // admin wajib isi trainer_id sesuai backend kamu
      trainer_id: toNumberOrNull(classForm.trainer_id),
    };

    if (!payload.name || !payload.schedule || payload.capacity == null) {
      setError("Class: name, schedule, capacity wajib diisi.");
      return;
    }

    try {
      if (editingClass) {
        // update: untuk admin, backend kamu TIDAK mewajibkan trainer_id saat PUT
        // tapi kita tetap kirim jika diisi (aman)
        const res = await api.put(`/api/classes/${editingClass.id}`, payload);
        const updated = res.data?.data;
        setClasses((prev) => prev.map((c) => (c.id === editingClass.id ? updated : c)));
      } else {
        // create: admin wajib trainer_id (sesuai views classes.py)
        if (!payload.trainer_id) {
          setError("Admin harus isi trainer_id saat create class.");
          return;
        }
        const res = await api.post(`/api/classes`, payload);
        const created = res.data?.data;
        setClasses((prev) => [created, ...prev]);
      }

      setClassModalOpen(false);
      setEditingClass(null);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || "Save class failed");
    }
  };

  const deleteClass = async (id) => {
    if (!confirm("Delete this class?")) return;
    setError("");
    try {
      await api.delete(`/api/classes/${id}`);
      setClasses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err?.response?.data?.error || "Delete class failed");
    }
  };

  /* ================= Derived ================= */
  const trainers = useMemo(
    () => users.filter((u) => String(u.role).toLowerCase() === "trainer"),
    [users]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gym-black flex items-center justify-center text-white">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gym-black py-8"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {/* ================= HEADER ================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-white">Admin Dashboard</h1>
              <p className="text-gray-400 mt-2">
                Welcome, <span className="text-gym-green font-bold">{user?.name}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <PillButton onClick={loadAll}>Refresh</PillButton>
              <PrimaryButton onClick={openCreatePlan}>+ Add Plan</PrimaryButton>
              <PrimaryButton onClick={openCreateClass}>+ Add Class</PrimaryButton>
            </div>
          </div>

          {error && (
            <div className="mt-5 p-3 rounded-lg border border-red-900 bg-red-900/20 text-red-200 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Users", value: users.length },
            { label: "Total Classes", value: classes.length },
            { label: "Membership Plans", value: plans.length },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center"
            >
              <p className="text-4xl font-black text-gym-green">{stat.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ================= USERS ================= */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">All Users</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 border-b border-zinc-800">
                <tr>
                  <th className="py-2 text-left">Name</th>
                  <th className="py-2 text-left">Email</th>
                  <th className="py-2 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-zinc-800/50">
                    <td className="py-2 text-white">{u.name}</td>
                    <td className="py-2 text-gray-400">{u.email}</td>
                    <td className="py-2 text-gym-green font-bold">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= MEMBERSHIP PLANS ================= */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-2xl font-bold text-white">Membership Plans</h2>
            <PrimaryButton onClick={openCreatePlan}>+ Create Plan</PrimaryButton>
          </div>

          <div className="space-y-3">
            {plans.map((p) => (
              <div
                key={p.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-zinc-800/50 p-4 rounded-lg"
              >
                <div>
                  <p className="text-white font-bold">{p.name}</p>
                  <p className="text-gray-400 text-sm">
                    Rp {Number(p.price).toLocaleString("id-ID")} / {p.duration_days} days
                  </p>
                  {Array.isArray(p.features) && p.features.length > 0 && (
                    <p className="text-gray-500 text-xs mt-1">
                      Features: {p.features.slice(0, 3).join(", ")}
                      {p.features.length > 3 ? "..." : ""}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <PillButton onClick={() => openEditPlan(p)}>EDIT</PillButton>
                  <DangerButton onClick={() => deletePlan(p.id)}>DELETE</DangerButton>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CLASSES ================= */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-2xl font-bold text-white">Classes</h2>
            <PrimaryButton onClick={openCreateClass}>+ Create Class</PrimaryButton>
          </div>

          <div className="space-y-3">
            {classes.map((c) => (
              <div
                key={c.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-zinc-800/50 p-4 rounded-lg"
              >
                <div>
                  <p className="text-white font-bold">{c.name}</p>
                  <p className="text-gray-400 text-sm">{c.schedule}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Capacity: {c.capacity} • Trainer ID: {c.trainer_id}
                  </p>
                </div>

                <div className="flex gap-2">
                  <PillButton onClick={() => openEditClass(c)}>EDIT</PillButton>
                  <DangerButton onClick={() => deleteClass(c.id)}>DELETE</DangerButton>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ================= MODAL: PLAN ================= */}
      <ModalShell
        open={planModalOpen}
        title={editingPlan ? "Edit Membership Plan" : "Create Membership Plan"}
        onClose={() => setPlanModalOpen(false)}
      >
        <form onSubmit={savePlan} className="space-y-4">
          <Input
            label="Name"
            value={planForm.name}
            onChange={(e) => setPlanForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Gold / Platinum / Basic"
          />

          <Input
            label="Price (Rupiah)"
            type="number"
            value={planForm.price}
            onChange={(e) => setPlanForm((p) => ({ ...p, price: e.target.value }))}
            placeholder="300000"
          />

          <Input
            label="Duration Days"
            type="number"
            value={planForm.duration_days}
            onChange={(e) => setPlanForm((p) => ({ ...p, duration_days: e.target.value }))}
            placeholder="30"
          />

          <TextArea
            label="Description"
            value={planForm.description}
            onChange={(e) => setPlanForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Akses semua kelas + trainer"
          />

          <TextArea
            label="Features (1 feature per line)"
            value={planForm.featuresText}
            onChange={(e) => setPlanForm((p) => ({ ...p, featuresText: e.target.value }))}
            placeholder={"Gym Access\nAll Classes\nPersonal Trainer"}
          />

          <div className="flex justify-end gap-2 pt-2">
            <PillButton type="button" onClick={() => setPlanModalOpen(false)}>
              Cancel
            </PillButton>
            <PrimaryButton type="submit">
              {editingPlan ? "Save Changes" : "Create Plan"}
            </PrimaryButton>
          </div>
        </form>
      </ModalShell>

      {/* ================= MODAL: CLASS ================= */}
      <ModalShell
        open={classModalOpen}
        title={editingClass ? "Edit Class" : "Create Class"}
        onClose={() => setClassModalOpen(false)}
      >
        <form onSubmit={saveClass} className="space-y-4">
          <Input
            label="Name"
            value={classForm.name}
            onChange={(e) => setClassForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="HIIT Cardio"
          />

          <Input
            label="Short Description (max 5 words)"
            value={classForm.short_description}
            onChange={(e) => setClassForm((p) => ({ ...p, short_description: e.target.value }))}
            placeholder="Burn fat fast"
          />

          <TextArea
            label="Description"
            value={classForm.description}
            onChange={(e) => setClassForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="High intensity interval training..."
          />

          <Input
            label="Image URL (optional)"
            value={classForm.image_url}
            onChange={(e) => setClassForm((p) => ({ ...p, image_url: e.target.value }))}
            placeholder="/images/classes/hiit.jpg"
          />

          <Input
            label="Schedule"
            value={classForm.schedule}
            onChange={(e) => setClassForm((p) => ({ ...p, schedule: e.target.value }))}
            placeholder="Every Monday 19:00"
          />

          <Input
            label="Capacity"
            type="number"
            value={classForm.capacity}
            onChange={(e) => setClassForm((p) => ({ ...p, capacity: e.target.value }))}
            placeholder="20"
          />

          {/* Admin create class butuh trainer_id */}
          <label className="block">
            <span className="block text-xs font-bold text-gray-400 mb-2">
              Trainer (required when create as admin)
            </span>
            <select
              value={classForm.trainer_id}
              onChange={(e) => setClassForm((p) => ({ ...p, trainer_id: e.target.value }))}
              className="w-full rounded-lg bg-zinc-800/60 border border-zinc-700 px-3 py-2 text-white outline-none focus:border-gym-green"
            >
              <option value="">-- pilih trainer --</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (ID: {t.id})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Kalau list trainer kosong, berarti belum ada user role <b>trainer</b>.
            </p>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <PillButton type="button" onClick={() => setClassModalOpen(false)}>
              Cancel
            </PillButton>
            <PrimaryButton type="submit">
              {editingClass ? "Save Changes" : "Create Class"}
            </PrimaryButton>
          </div>
        </form>
      </ModalShell>
    </motion.div>
  );
}
