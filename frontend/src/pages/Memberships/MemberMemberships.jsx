import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { initialPlans, activeMembership } from "./MembershipsData";

const MemberMemberships = () => {
  const [myMembership, setMyMembership] = useState(activeMembership); 
  const [availablePlans] = useState(initialPlans);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleSubscribe = (planId) => {
    if(window.confirm("Langganan paket ini sekarang?")) {
        alert("Integrasi Backend: Kirim POST ke /api/memberships/" + planId + "/subscribe");
    }
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    hover: {
      y: -10,
      boxShadow: '0 20px 40px rgba(57, 255, 20, 0.2)',
      borderColor: '#39ff14',
      transition: { duration: 0.3 },
    },
  };

  const membershipCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gym-black py-8 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION 1: MY ACTIVE MEMBERSHIP */}
        <motion.div
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="text-3xl font-black text-white mb-6 uppercase italic border-l-4 border-gym-green pl-4"
            variants={itemVariants}
          >
            Membership <motion.span
              className="text-gym-green"
              animate={{ color: ['#39ff14', '#2ed612', '#39ff14'] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              Status
            </motion.span>
          </motion.h2>

          {myMembership ? (
            <motion.div
              className="bg-gradient-to-r from-zinc-900 to-black border border-zinc-700 rounded-2xl p-8 relative overflow-hidden shadow-2xl"
              variants={membershipCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ borderColor: '#39ff14' }}
            >
              {/* Decorative Background */}
              <motion.div
                className="absolute top-0 right-0 w-64 h-64 bg-gym-green/5 rounded-full blur-3xl -mr-16 -mt-16"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />
              
              <motion.div
                className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div>
                  <motion.div
                    className="inline-block px-3 py-1 bg-green-900/30 border border-green-500 text-green-400 text-xs font-bold rounded-full mb-3 uppercase tracking-wider"
                    variants={itemVariants}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {myMembership.status}
                  </motion.div>
                  <motion.h3
                    className="text-4xl font-black text-white italic mb-1"
                    variants={itemVariants}
                  >
                    {myMembership.plan.name}
                  </motion.h3>
                  <motion.p className="text-gray-400" variants={itemVariants}>
                    Valid until: <span className="text-white font-bold">{formatDate(myMembership.end_at)}</span>
                  </motion.p>
                </div>

                <motion.div className="text-right" variants={itemVariants}>
                    <p className="text-sm text-gray-400 mb-1">Started at</p>
                    <motion.p
                      className="text-xl font-bold text-white"
                      animate={{ textShadow: ['0 0 10px rgba(57, 255, 20, 0.3)', '0 0 20px rgba(57, 255, 20, 0.6)', '0 0 10px rgba(57, 255, 20, 0.3)'] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                    >
                      {formatDate(myMembership.start_at)}
                    </motion.p>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
             <motion.div
               className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl text-center"
               variants={membershipCardVariants}
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, amount: 0.3 }}
             >
                <motion.p className="text-gray-400 mb-4" variants={itemVariants}>
                  Anda belum memiliki membership aktif.
                </motion.p>
                <motion.p
                  className="text-gym-green font-bold"
                  variants={itemVariants}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  Pilih paket di bawah untuk mulai berlatih!
                </motion.p>
             </motion.div>
          )}
        </motion.div>

        {/* SECTION 2: AVAILABLE PLANS */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            className="text-3xl font-black text-white mb-6 uppercase italic border-l-4 border-white pl-4"
            variants={itemVariants}
          >
            Available <span className="text-gray-500">Plans</span>
          </motion.h2>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {availablePlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 hover:border-gym-green transition-all duration-300 flex flex-col"
                variants={cardVariants}
                whileHover="hover"
                custom={index}
              >
                <motion.h3
                  className="text-2xl font-black text-white italic uppercase mb-2"
                  variants={itemVariants}
                >
                  {plan.name}
                </motion.h3>
                <motion.div className="text-3xl font-bold text-gym-green mb-4" variants={itemVariants}>
                  {formatRupiah(plan.price)}
                  <motion.span
                    className="text-sm text-gray-500 font-normal block mt-1"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    Durasi: {plan.duration_days} Hari
                  </motion.span>
                </motion.div>
                
                <motion.ul
                  className="text-gray-400 text-sm mb-8 space-y-3 flex-grow border-t border-zinc-800 pt-4 mt-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                   <motion.li className="flex items-start gap-2" variants={itemVariants}>
                     <motion.svg
                       className="w-5 h-5 text-gym-green shrink-0"
                       fill="none"
                       stroke="currentColor"
                       viewBox="0 0 24 24"
                       animate={{ scale: [1, 1.2, 1] }}
                       transition={{ repeat: Infinity, duration: 2 }}
                     >
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                     </motion.svg>
                     {plan.description}
                   </motion.li>
                   <motion.li className="flex items-start gap-2" variants={itemVariants}>
                     <motion.svg
                       className="w-5 h-5 text-gym-green shrink-0"
                       fill="none"
                       stroke="currentColor"
                       viewBox="0 0 24 24"
                       animate={{ scale: [1, 1.2, 1] }}
                       transition={{ repeat: Infinity, duration: 2, delay: 0.1 }}
                     >
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                     </motion.svg>
                     Akses Fasilitas Gym
                   </motion.li>
                </motion.ul>

                <motion.button
                  onClick={() => handleSubscribe(plan.id)}
                  className="w-full py-4 bg-white hover:bg-gym-green text-black font-black uppercase tracking-wider rounded transition-colors"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(57, 255, 20, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  SUBSCRIBE NOW
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default MemberMemberships;