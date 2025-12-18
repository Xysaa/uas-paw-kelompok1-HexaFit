import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/authContext";
import api from "../../api/client";

/* ================== FRAMER MOTION VARIANTS ================== */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalContent = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};
/* ============================================================ */

const STATUS_OPTIONS = ["present", "absent", "late"];

const roleValue = (u) => (u?.role?.value ? u.role.value : u?.role);

const TrainerDashboard = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const [myClasses, setMyClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  // participants dari /participants
  const [participants, setParticipants] = useState([]);
  // attendance map: member_id -> {status, marked_at, ...}
  const [attendanceMap, setAttendanceMap] = useState({});

  /* ================= FETCH MY CLASSES ================= */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrMsg("");

      try {
        // GET /api/classes (public)
        const res = await api.get("/api/classes");
        const all = res.data?.data || [];

        const my = all.filter((c) => Number(c.trainer_id) === Number(user?.id));
        setMyClasses(my);

        // auto select pertama
        if (my.length > 0) {
          setSelectedClass(my[0]);
        } else {
          setSelectedClass(null);
        }
      } catch (e) {
        console.error(e);
        setErrMsg(
          e?.response?.data?.error ||
            e?.response?.data?.message ||
            "Gagal memuat kelas trainer."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && roleValue(user) === "trainer") load();
    else setLoading(false);
  }, [user?.id]);

  /* ================= FETCH PARTICIPANTS + ATTENDANCE WHEN CLASS SELECTED ================= */
  useEffect(() => {
    const loadClassData = async () => {
      if (!selectedClass?.id) return;

      setErrMsg("");
      try {
        // 1) participants
        const pRes = await api.get(`/api/classes/${selectedClass.id}/participants`);
        const pData = pRes.data?.data || pRes.data || [];

        // normalisasi peserta
        const normalized = (Array.isArray(pData) ? pData : []).map((p) => ({
          member_id: Number(p.member_id ?? p.id ?? p.member?.id),
          name: p.name ?? p.member_name ?? p.member?.name ?? "-",
          email: p.email ?? p.member_email ?? p.member?.email ?? "-",
        })).filter((p) => !!p.member_id);

        setParticipants(normalized);

        // 2) attendance list untuk kelas ini
        const aRes = await api.get(`/api/classes/${selectedClass.id}/attendance/list`);
        const rows = aRes.data?.data || [];

        const map = {};
        rows.forEach((r) => {
          const mid = Number(r.member_id);
          if (!mid) return;
          map[mid] = {
            status: r.status,
            marked_at: r.marked_at,
            member_name: r.member_name,
            member_email: r.member_email,
          };
        });
        setAttendanceMap(map);
      } catch (e) {
        console.error(e);
        setParticipants([]);
        setAttendanceMap({});
        setErrMsg(
          e?.response?.data?.error ||
            e?.response?.data?.message ||
            "Gagal memuat peserta/absensi kelas."
        );
      }
    };

    loadClassData();
  }, [selectedClass?.id]);

  /* ================= STATS ================= */
  const stats = useMemo(() => {
    const totalClasses = myClasses.length;
    const totalMembersThisClass = participants.length;

    // hitung hadir (present)
    const presentCount = Object.values(attendanceMap).filter(
      (x) => x?.status === "present"
    ).length;

    return {
      totalClasses,
      totalMembersThisClass,
      presentCount,
    };
  }, [myClasses, participants, attendanceMap]);

  /* ================= ACTIONS ================= */
  const openAttendance = () => {
    if (!selectedClass?.id) return;
    setIsAttendanceModalOpen(true);
  };

  const closeAttendance = () => setIsAttendanceModalOpen(false);

  const setStatus = async (memberId, status) => {
    if (!selectedClass?.id) return;
    if (!STATUS_OPTIONS.includes(status)) return;

    try {
      // POST /api/classes/{id}/attendance
      const res = await api.post(`/api/classes/${selectedClass.id}/attendance`, {
        member_id: memberId,
        status,
      });

      const a = res.data?.data;
      // update local map (optimistic-ish)
      setAttendanceMap((prev) => ({
        ...prev,
        [memberId]: {
          ...(prev[memberId] || {}),
          status: a?.status || status,
          marked_at: a?.marked_at || new Date().toISOString(),
        },
      }));
    } catch (e) {
      console.error(e);
      alert(
        e?.response?.data?.error ||
          e?.response?.data?.message ||
          "Gagal menyimpan absensi."
      );
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gym-black flex items-center justify-center text-white">
        Loading Trainer Dashboard...
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gym-black py-8"
      initial="hidden"
      animate="visible"
      variants={fadeUp}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl p-8"
        >
          <h1 className="text-4xl font-black text-white mb-2">
            Trainer Portal,{" "}
            <span className="text-gym-green">{user?.name}!</span>
          </h1>
          <p className="text-gray-400">
            Role: <span className="text-gym-green font-bold">Trainer</span>
          </p>
        </motion.div>

        {/* ERROR */}
        {errMsg && (
          <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-200">
            {errMsg}
          </div>
        )}

        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: "My Classes", value: stats.totalClasses },
            { label: "Members (Selected Class)", value: stats.totalMembersThisClass },
            { label: "Present (Selected Class)", value: stats.presentCount },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -5 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center"
            >
              <p className="text-4xl font-black text-gym-green">{stat.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CLASS PICKER */}
        <motion.div variants={fadeUp} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">My Classes</h2>
              <p className="text-gray-400 text-sm">
                Pilih kelas untuk melihat peserta & absensi.
              </p>
            </div>

            <div className="flex gap-3 items-center">
              <select
                value={selectedClass?.id || ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  const found = myClasses.find((c) => Number(c.id) === id);
                  setSelectedClass(found || null);
                }}
                className="bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2 outline-none"
              >
                {myClasses.length === 0 ? (
                  <option value="">(No class)</option>
                ) : (
                  myClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.schedule}
                    </option>
                  ))
                )}
              </select>

              <button
                onClick={openAttendance}
                disabled={!selectedClass?.id}
                className={`px-5 py-2 rounded-xl font-bold ${
                  selectedClass?.id
                    ? "bg-gym-green text-black"
                    : "bg-zinc-800 text-gray-500 cursor-not-allowed"
                }`}
              >
                MARK ATTENDANCE
              </button>
            </div>
          </div>

          {/* quick info */}
          {selectedClass && (
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                <p className="text-gray-400 text-xs">Class</p>
                <p className="text-white font-bold">{selectedClass.name}</p>
              </div>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                <p className="text-gray-400 text-xs">Schedule</p>
                <p className="text-white font-bold">{selectedClass.schedule}</p>
              </div>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                <p className="text-gray-400 text-xs">Capacity</p>
                <p className="text-white font-bold">{selectedClass.capacity}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* PARTICIPANTS LIST */}
        <motion.div variants={fadeUp} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Participants{" "}
            <span className="text-gray-400 text-sm font-normal">
              (kelas terpilih)
            </span>
          </h2>

          {participants.length === 0 ? (
            <p className="text-gray-500">Belum ada member yang booking kelas ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-500 border-b border-zinc-800">
                  <tr>
                    <th className="py-2 text-left">Name</th>
                    <th className="py-2 text-left">Email</th>
                    <th className="py-2 text-left">Status</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p) => {
                    const current = attendanceMap[p.member_id]?.status || "—";
                    return (
                      <tr key={p.member_id} className="border-b border-zinc-800/50">
                        <td className="py-3 text-white">{p.name}</td>
                        <td className="py-3 text-gray-400">{p.email}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              current === "present"
                                ? "text-gym-green bg-green-900/20"
                                : current === "late"
                                ? "text-yellow-300 bg-yellow-900/20"
                                : current === "absent"
                                ? "text-red-400 bg-red-900/20"
                                : "text-gray-300 bg-zinc-800/60"
                            }`}
                          >
                            {String(current).toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setStatus(p.member_id, "present")}
                              className="px-3 py-1 rounded text-xs font-bold bg-gym-green text-black"
                            >
                              PRESENT
                            </button>
                            <button
                              onClick={() => setStatus(p.member_id, "late")}
                              className="px-3 py-1 rounded text-xs font-bold bg-yellow-300 text-black"
                            >
                              LATE
                            </button>
                            <button
                              onClick={() => setStatus(p.member_id, "absent")}
                              className="px-3 py-1 rounded text-xs font-bold bg-red-900/30 text-red-300 border border-red-900"
                            >
                              ABSENT
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* MODAL ATTENDANCE (bulk quick set) */}
        <AnimatePresence>
          {isAttendanceModalOpen && selectedClass?.id && (
            <motion.div
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4"
              variants={modalBackdrop}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={closeAttendance}
            >
              <motion.div
                variants={modalContent}
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Mark Attendance —{" "}
                      <span className="text-gym-green">{selectedClass.name}</span>
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Klik status untuk tiap member. Otomatis tersimpan ke server.
                    </p>
                  </div>
                  <button
                    onClick={closeAttendance}
                    className="text-white/70 hover:text-white"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-5 space-y-2 max-h-[55vh] overflow-y-auto">
                  {participants.length === 0 ? (
                    <p className="text-gray-500">Belum ada peserta.</p>
                  ) : (
                    participants.map((p) => {
                      const current = attendanceMap[p.member_id]?.status || "—";
                      return (
                        <div
                          key={p.member_id}
                          className="flex items-center justify-between gap-3 bg-black/40 p-3 rounded-lg border border-white/5"
                        >
                          <div className="min-w-0">
                            <p className="text-white font-semibold truncate">
                              {p.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {p.email}
                            </p>
                          </div>

                          <div className="flex gap-2 items-center">
                            {STATUS_OPTIONS.map((s) => (
                              <button
                                key={s}
                                onClick={() => setStatus(p.member_id, s)}
                                className={`px-3 py-1 rounded text-xs font-bold ${
                                  current === s
                                    ? "bg-gym-green text-black"
                                    : "bg-zinc-700 text-gray-200"
                                }`}
                              >
                                {s.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={closeAttendance}
                    className="px-5 py-2 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition"
                  >
                    CLOSE
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TrainerDashboard;
