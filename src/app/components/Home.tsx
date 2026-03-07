import { Link } from "react-router";
import { Car, Truck, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden font-sans selection:bg-red-600 selection:text-white"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 30%, #3a0a0a 0%, #1a0404 40%, #080808 100%)" }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-red-900/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="relative z-10 mb-14 w-full max-w-xs flex items-center justify-center"
      >
        <img
          src="/logo.png"
          alt="Almila Filo Kiralama"
          className="w-72 h-72 object-contain"
          style={{ filter: "drop-shadow(0 0 30px rgba(180,20,20,0.35))" }}
        />
      </motion.div>

      <div className="relative z-10 w-full max-w-xs flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
        >
          <Link
            to="/vehicles/yonetim"
            className="group relative flex items-center justify-between bg-black/40 border border-white/[0.08] hover:border-red-600/40 backdrop-blur-sm transition-all duration-500 p-6 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl border border-white/[0.08] group-hover:border-red-500/40 flex items-center justify-center transition-colors duration-400">
                <Car className="w-5 h-5 text-neutral-500 group-hover:text-red-400 transition-colors duration-400" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-sm font-light text-neutral-200 group-hover:text-white tracking-[0.3em] transition-colors duration-400">YÖNETİM</h2>
                <p className="text-[9px] text-neutral-600 group-hover:text-red-500/60 tracking-[0.2em] mt-0.5 transition-colors duration-400">FİLO YÖNETİMİ</p>
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
            className="group relative flex items-center justify-between bg-black/40 border border-white/[0.08] hover:border-red-600/40 backdrop-blur-sm transition-all duration-500 p-6 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl border border-white/[0.08] group-hover:border-red-500/40 flex items-center justify-center transition-colors duration-400">
                <Truck className="w-5 h-5 text-neutral-500 group-hover:text-red-400 transition-colors duration-400" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-sm font-light text-neutral-200 group-hover:text-white tracking-[0.3em] transition-colors duration-400">TİCARİ</h2>
                <p className="text-[9px] text-neutral-600 group-hover:text-red-500/60 tracking-[0.2em] mt-0.5 transition-colors duration-400">TİCARİ ARAÇLAR</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-700 group-hover:text-red-500 transition-colors duration-400 relative z-10" />
          </Link>
        </motion.div>
      </div>

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
