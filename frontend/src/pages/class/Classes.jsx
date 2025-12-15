import { motion } from 'framer-motion';
import Navbar from '../../components/navbar';
import { Calendar, Clock, User } from 'lucide-react';

// Data Mockup (Nanti diganti fetch API dari Backend)
const classesData = [
  { id: 1, name: 'Yoga Flow', trainer: 'Esther Howard', time: '09:00 AM', image: 'https://images.unsplash.com/photo-1544367563-12123d8975b9?auto=format&fit=crop&q=80&w=1000' },
  { id: 2, name: 'Power Lifting', trainer: 'Cody Fisher', time: '11:00 AM', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000' },
  { id: 3, name: 'Cardio Blast', trainer: 'Jenny Wilson', time: '02:00 PM', image: 'https://images.unsplash.com/photo-1534258936925-c48947387603?auto=format&fit=crop&q=80&w=1000' },
];

const Classes = () => {
  return (
    <div className="bg-dark min-h-screen text-white pt-24 pb-12 px-6">
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-primary font-bold tracking-widest text-sm mb-2">OUR CLASSES</h2>
            <h3 className="text-4xl font-bold">Personalized Fitness<br/>Classes for Every Goal</h3>
          </div>
          <button className="border border-primary text-primary px-6 py-2 rounded hover:bg-primary hover:text-black transition">More Classes</button>
        </div>

        {/* Grid Card Layout */}
        <div className="grid md:grid-cols-3 gap-8">
          {classesData.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative overflow-hidden rounded-xl h-[400px] cursor-pointer"
            >
              <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
              
              <div className="absolute bottom-0 p-6 w-full">
                <h4 className="text-2xl font-bold mb-2">{item.name}</h4>
                <div className="flex flex-col gap-2 text-gray-300 text-sm mb-4">
                  <div className="flex items-center gap-2"><User size={16} className="text-primary"/> {item.trainer}</div>
                  <div className="flex items-center gap-2"><Clock size={16} className="text-primary"/> {item.time}</div>
                </div>
                <button className="w-full bg-primary text-black py-3 rounded font-bold translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Simple Schedule Table Preview */}
        <div className="mt-20">
          <h3 className="text-center text-3xl font-bold mb-10">Weekly Class Schedule</h3>
          <div className="overflow-x-auto bg-secondary/30 p-6 rounded-xl border border-gray-800">
             {/* Gunakan CSS Grid atau Table HTML standar disini sesuai referensi gambar kanan */}
             <div className="text-center text-gray-500 py-10">Schedule Table Component Here...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classes;
