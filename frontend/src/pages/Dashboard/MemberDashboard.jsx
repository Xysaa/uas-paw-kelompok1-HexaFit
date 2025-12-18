import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../../api/client";
import { useAuth } from "../../context/authContext";

/* ===== Variants (simple) ===== */
const pageVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
};

const card = "bg-zinc-900 border border-zinc-800 rounded-xl p-6";
const label = "text-xs text-gray-500";
const value = "text-white font-bold";

const roleValue = (u) => (u?.role?.value ? u.role.value : u?.role);

const isActiveMembership = (m) => {
  if (!m) return false;
  if (m.status !== "active") return false;
  if (!m.end_at) return false;
  return new Date(m.end_at).getTime() > Date.now();
};

const formatDateTime = (iso) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("id-ID");
  } catch {
    return iso;
  }
};

const formatMoney = (n) => {
  const num = Number(n || 0);
  return num.toLocaleString("id-ID");
};

export default function MemberDashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [membership, setMembership] = useState(null); // from /api/my/membership
  const [bookings, setBookings] = useState([]); // from /api/bookings
  const [attendance, setAttendance] = useState([]); // from /api/my/attendance
  const [plans, setPlans] = useState([]); // from /api/memberships (for quick subscribe)

  const subscribed = useMemo(() => isActiveMembership(membership), [membership]);

  const loadAll = async () => {
    setErr("");
    setLoading(true);
    try {
      const [mRes, bRes, aRes, pRes] = await Promise.all([
        api.get("/api/my/membership"),
        api.get("/api/bookings"),
        api.get("/api/my/attendance"),
        api.get("/api/memberships"),
      ]);

      // membership
      setMembership(mRes.data?.data || null);

      // bookings: fallback kalau format beda
      const bData = bRes.data?.data ?? bRes.data ?? [];
      setBookings(Array.isArray(bData) ? bData : []);

      // attendance
      const aData = aRes.data?.data ?? aRes.data ?? [];
      setAttendance(Array.isArray(aData) ? aData : []);

      // plans (public list)
      setPlans(pRes.data?.data || []);
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.error || e?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const subscribePlan = async (planId) => {
    if (!confirm("Aktifkan membership ini?")) return;
    setErr("");
    try {
      const res = await api.post(`/api/memberships/${planId}/subscribe`);
      setMembership(res.data?.data || null);
      alert("Membership activated ✅");
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Subscribe failed";
      setErr(msg);
    }
  };

  // Optional: kalau kamu mau ada tombol booking dari dashboard.
  // Kalau backend booking butuh payload lain, edit di sini.
  // const bookClass = async (classId) => {
  //   if (!subscribed) {
  //     setErr("Kamu harus punya membership aktif untuk booking class.");
  //     return;
  //   }
  //   setErr("");
  //   try {
  //     await api.post(`/api/classes/${classId}/book`);
  //     await loadAll();
  //     alert("Booked ✅");
  //   } catch (e) {
  //     setErr(e?.response?.data?.error || "Booking failed");
  //   }
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gym-black flex items-center justify-center text-white">
        Loading Member Dashboard...
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gym-black py-8"
      variants={pageVariant}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-black text-white">
                Member Dashboard
              </h1>
              <p className="text-gray-400 mt-1">
                Hi, <span className="text-gym-green font-bold">{user?.name}</span>{" "}
                • Role:{" "}
                <span className="text-gym-green font-bold">
                  {String(roleValue(user) || "member")}
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={loadAll}
                className="px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-white text-sm font-bold hover:border-gym-green hover:text-gym-green transition"
              >
                Refresh
              </button>
              <Link
                to="/member/memberships"
                className="px-4 py-2 rounded-lg bg-gym-green text-black text-sm font-black hover:opacity-90 transition"
              >
                View Plans
              </Link>
            </div>
          </div>

          {err && (
            <div className="mt-4 p-3 rounded-lg border border-red-900 bg-red-900/20 text-red-200 text-sm">
              {err}
            </div>
          )}
        </div>

        {/* Simple status cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={card}>
            <p className={label}>Membership Status</p>
            <p className={`text-lg font-black ${subscribed ? "text-gym-green" : "text-red-300"}`}>
              {subscribed ? "ACTIVE" : "NOT SUBSCRIBED"}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {membership?.plan?.name ? (
                <>
                  Plan: <span className="text-white font-bold">{membership.plan.name}</span>
                  <br />
                  Ends: <span className="text-white">{formatDateTime(membership.end_at)}</span>
                </>
              ) : (
                "Belum punya membership aktif."
              )}
            </p>
          </div>

          <div className={card}>
            <p className={label}>My Bookings</p>
            <p className="text-3xl font-black text-gym-green">{bookings.length}</p>
            <p className="text-sm text-gray-500 mt-2">
              {bookings.length ? "Kamu sudah join beberapa kelas." : "Belum join kelas apapun."}
            </p>
          </div>

          <div className={card}>
            <p className={label}>Attendance Logs</p>
            <p className="text-3xl font-black text-gym-green">{attendance.length}</p>
            <p className="text-sm text-gray-500 mt-2">
              {attendance.length ? "Riwayat kehadiran tersedia." : "Belum ada log kehadiran."}
            </p>
          </div>
        </div>

        {/* Membership detail + quick subscribe */}
        <section className={card}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-black text-white">My Membership</h2>
            {!subscribed && (
              <span className="text-xs px-2 py-1 rounded bg-red-900/20 border border-red-900 text-red-200">
                Booking class dikunci sampai membership aktif
              </span>
            )}
          </div>

          {subscribed ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className={label}>Plan</p>
                <p className={value}>{membership?.plan?.name || "-"}</p>
              </div>
              <div>
                <p className={label}>Price</p>
                <p className={value}>Rp {formatMoney(membership?.plan?.price)}</p>
              </div>
              <div>
                <p className={label}>Start</p>
                <p className={value}>{formatDateTime(membership?.start_at)}</p>
              </div>
              <div>
                <p className={label}>End</p>
                <p className={value}>{formatDateTime(membership?.end_at)}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                Kamu belum berlangganan. Pilih salah satu plan di bawah untuk mengaktifkan membership.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {plans.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4"
                  >
                    <p className="text-white font-bold">{p.name}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Rp {formatMoney(p.price)} / {p.duration_days} days
                    </p>
                    <button
                      onClick={() => subscribePlan(p.id)}
                      className="mt-3 w-full py-2 rounded bg-gym-green text-black font-black text-sm hover:opacity-90 transition"
                    >
                      Subscribe
                    </button>
                  </div>
                ))}
              </div>

              <Link
                to="/member/memberships"
                className="inline-block text-gym-green font-bold text-sm hover:underline"
              >
                Lihat semua membership plans →
              </Link>
            </div>
          )}
        </section>

        {/* Booking section (read-only) */}
        <section className={card}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-black text-white">My Classes (Bookings)</h2>
            <Link
              to="/member/classes"
              className={`px-4 py-2 rounded-lg text-sm font-black transition ${
                subscribed
                  ? "bg-gym-green text-black hover:opacity-90"
                  : "bg-zinc-800 text-gray-400 cursor-not-allowed"
              }`}
              onClick={(e) => {
                if (!subscribed) {
                  e.preventDefault();
                  setErr("Kamu harus punya membership aktif untuk booking class.");
                }
              }}
            >
              {subscribed ? "Book Class" : "Locked"}
            </Link>
          </div>

          {bookings.length === 0 ? (
            <p className="text-gray-400 text-sm">
              Belum ada booking. {subscribed ? "Silakan booking kelas dari menu Classes." : "Aktifkan membership dulu."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-500 border-b border-zinc-800">
                  <tr>
                    <th className="py-2 text-left">Class</th>
                    <th className="py-2 text-left">Schedule</th>
                    <th className="py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-zinc-800/50">
                      <td className="py-2 text-white">
                        {b?.gym_class?.name || b?.class?.name || b?.class_name || b?.name || "-"}
                      </td>
                      <td className="py-2 text-gray-400">
                        {b?.gym_class?.schedule || b?.class?.schedule || b?.schedule || "-"}
                      </td>
                      <td className="py-2">
                        <span className="px-2 py-1 rounded text-xs font-bold bg-zinc-800 border border-zinc-700 text-gray-200">
                          {b?.status || "booked"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Attendance history */}
        <section className={card}>
          <h2 className="text-xl font-black text-white mb-4">Attendance Log</h2>

          {attendance.length === 0 ? (
            <p className="text-gray-400 text-sm">Belum ada log kehadiran.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-500 border-b border-zinc-800">
                  <tr>
                    <th className="py-2 text-left">Class</th>
                    <th className="py-2 text-left">Schedule</th>
                    <th className="py-2 text-left">Status</th>
                    <th className="py-2 text-left">Marked At</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a) => (
                    <tr key={a.id} className="border-b border-zinc-800/50">
                      <td className="py-2 text-white">{a?.class?.name || "-"}</td>
                      <td className="py-2 text-gray-400">{a?.class?.schedule || "-"}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            a.status === "present"
                              ? "text-gym-green bg-green-900/20 border border-green-900"
                              : a.status === "late"
                              ? "text-yellow-300 bg-yellow-900/20 border border-yellow-900"
                              : "text-red-300 bg-red-900/20 border border-red-900"
                          }`}
                        >
                          {String(a.status || "-").toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2 text-gray-400">{formatDateTime(a.marked_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </motion.div>
  );
}
