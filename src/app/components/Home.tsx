import { Link } from "react-router";
import { Car, Truck, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export function Home() {
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden font-sans selection:bg-red-600 selection:text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-red-700/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-red-600/[0.05] rounded-full blur-[80px] pointer-events-none" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="relative z-10 mb-16 w-full max-w-xs flex items-center justify-center"
      >
        <img
          src="/logo.jpg"
          alt="Almila Filo Kiralama"
          className="w-64 h-64 object-contain drop-shadow-2xl"
        />
      </motion.div>

      {/* Category Cards */}
      <div className="relative z-10 w-full max-w-xs flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
        >
          <Link
            to="/vehicles/yonetim"
            className="group relative flex items-center justify-between bg-[#0d0d0d] border border-white/[0.07] hover:border-red-600/35 transition-all duration-500 p-6 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl border border-white/[0.06] group-hover:border-red-500/30 flex items-center justify-center transition-colors duration-400">
                <Car className="w-5 h-5 text-neutral-600 group-hover:text-red-500 transition-colors duration-400" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-sm font-light text-neutral-200 group-hover:text-white tracking-[0.3em] transition-colors duration-400">YÖNETİM</h2>
                <p className="text-[9px] text-neutral-700 group-hover:text-red-500/50 tracking-[0.2em] mt-0.5 transition-colors duration-400">FİLO YÖNETİMİ</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-700 group-hover:text-red-500 transition-colors duration-400 relative z-10" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
        >
          <Link
            to="/vehicles/ticari"
            className="group relative flex items-center justify-between bg-[#0d0d0d] border border-white/[0.07] hover:border-red-600/35 transition-all duration-500 p-6 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl border border-white/[0.06] group-hover:border-red-500/30 flex items-center justify-center transition-colors duration-400">
                <Truck className="w-5 h-5 text-neutral-600 group-hover:text-red-500 transition-colors duration-400" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-sm font-light text-neutral-200 group-hover:text-white tracking-[0.3em] transition-colors duration-400">YÖNETİM ARAÇLARI</h2>
                <p className="text-[9px] text-neutral-700 group-hover:text-red-500/50 tracking-[0.2em] mt-0.5 transition-colors duration-400">TİCARİ ARAÇLAR</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-700 group-hover:text-red-500 transition-colors duration-400 relative z-10" />
          </Link>
        </motion.div>
      </div>

      {/* Kontrol Paneli */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.7 }}
        className="absolute bottom-8 z-10"
      >
        <Link
          to="/kontrol-paneli"
          className="group flex items-center gap-3 text-[9px] text-neutral-700 hover:text-white tracking-[0.35em] uppercase transition-colors duration-400"
        >
          <span className="w-6 h-[1px] bg-neutral-800 group-hover:bg-red-600 transition-colors duration-400" />
          <span>Kontrol Paneli</span>
          <ChevronRight className="w-3 h-3 group-hover:text-red-500 transition-colors duration-400" />
        </Link>
      </motion.div>
    </div>
  );
}
