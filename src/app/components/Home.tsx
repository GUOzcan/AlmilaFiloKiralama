import { Link } from "react-router";
import { Car, Truck, ChevronRight, LayoutDashboard } from "lucide-react";
import { motion } from "motion/react";

export function Home() {
  return (
    <div
      className="font-sans selection:bg-red-600 selection:text-white"
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 'env(safe-area-inset-top)',
        background: "radial-gradient(ellipse 100% 70% at 50% 0%, #2d0606 0%, #120202 45%, #080808 100%)"
      }}
    >
      {/* Üst kırmızı parlaklık */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-red-800/30 rounded-full blur-[120px] pointer-events-none" />

      {/* LOGO — ortalı */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-8"
      >
        <img
          src="/logo.png"
          alt="Almila Filo Kiralama"
          className="w-full max-w-[280px] object-contain"
          style={{ filter: "drop-shadow(0 0 40px rgba(180,20,20,0.4)) drop-shadow(0 0 12px rgba(180,20,20,0.25))" }}
        />
      </motion.div>

      {/* KARTLAR — alt */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 w-full px-6 flex flex-col gap-3"
        style={{ paddingBottom: 'max(40px, env(safe-area-inset-bottom))' }}
      >
        <Link
          to="/vehicles/yonetim"
          className="group relative flex items-center justify-between bg-black/50 border border-white/[0.08] hover:border-red-600/50 active:border-red-600/50 backdrop-blur-sm transition-all duration-300 px-6 py-5 rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl border border-white/[0.08] group-hover:border-red-500/40 flex items-center justify-center transition-colors duration-300">
              <Car className="w-5 h-5 text-neutral-500 group-hover:text-red-400 transition-colors duration-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-sm font-light text-neutral-200 group-hover:text-white tracking-[0.35em] transition-colors duration-300">YÖNETİM</h2>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-700 group-hover:text-red-500 transition-colors duration-300 relative z-10" />
        </Link>

        <Link
          to="/vehicles/ticari"
          className="group relative flex items-center justify-between bg-black/50 border border-white/[0.08] hover:border-red-600/50 active:border-red-600/50 backdrop-blur-sm transition-all duration-300 px-6 py-5 rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl border border-white/[0.08] group-hover:border-red-500/40 flex items-center justify-center transition-colors duration-300">
              <Truck className="w-5 h-5 text-neutral-500 group-hover:text-red-400 transition-colors duration-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-sm font-light text-neutral-200 group-hover:text-white tracking-[0.35em] transition-colors duration-300">TİCARİ</h2>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-700 group-hover:text-red-500 transition-colors duration-300 relative z-10" />
        </Link>

        <Link
          to="/kontrol-paneli"
          className="group relative flex items-center justify-between bg-black/50 border border-white/[0.08] hover:border-red-600/50 active:border-red-600/50 backdrop-blur-sm transition-all duration-300 px-6 py-5 rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl border border-white/[0.08] group-hover:border-red-500/40 flex items-center justify-center transition-colors duration-300">
              <LayoutDashboard className="w-5 h-5 text-neutral-500 group-hover:text-red-400 transition-colors duration-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-sm font-light text-neutral-200 group-hover:text-white tracking-[0.35em] transition-colors duration-300">KONTROL PANELİ</h2>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-700 group-hover:text-red-500 transition-colors duration-300 relative z-10" />
        </Link>
      </motion.div>
    </div>
  );
}
