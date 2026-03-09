import { loadVehicles, generateAlerts } from "../data/vehicleData"
import { AlertCircle, AlertTriangle, ArrowLeft, Car } from "lucide-react"
import { Link } from "react-router"
import { motion } from "motion/react"
import { useState, useEffect } from "react"
import { formatTR } from "../data/statusEngine"

export function ControlPanel() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVehicles().then(all => { setVehicles(all); setLoading(false) })
  }, [])

  const alerts = generateAlerts(vehicles)
  const yonetimCount = vehicles.filter(v => v.category === "Yönetim").length
  const ticariCount = vehicles.filter(v => v.category === "Ticari").length
  const redAlerts = alerts.filter(a => a.status === "expired").length
  const yellowWarnings = alerts.filter(a => a.status === "warning").length

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
  const itemVariants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans pb-24 relative" style={{overflowX:"hidden", overflowY:"auto", WebkitOverflowScrolling:"touch", minHeight:"-webkit-fill-available"}}>
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-red-600/[0.025] blur-[90px] pointer-events-none" />

      <div className="fixed top-0 left-0 right-0 z-20 bg-[#080808] border-b border-white/[0.06] px-5 py-4 flex items-center justify-between">
        <Link to="/" className="w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.08] text-neutral-400 hover:text-white transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="text-[10px] tracking-[0.35em] text-neutral-500 uppercase font-light">Kontrol Paneli</span>
        <div className="w-9" />
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-5 h-5 border border-red-500/40 border-t-red-500 rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-lg mx-auto px-5 py-6 relative z-10" style={{paddingTop:"80px"}}>
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
            <div className="col-span-2 bg-[#0d0d0d] border border-white/[0.07] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span className="block text-[9px] tracking-[0.35em] text-neutral-600 mb-2">TOPLAM ARAÇ</span>
                <span className="text-4xl font-light tracking-wider">{vehicles.length}</span>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <div className="flex items-center gap-2 text-[9px] tracking-[0.2em] text-neutral-500">
                  <Car className="w-3 h-3" /><span>YÖNETİM</span><span className="text-white">{yonetimCount}</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] tracking-[0.2em] text-neutral-500">
                  <Car className="w-3 h-3" /><span>TİCARİ</span><span className="text-white">{ticariCount}</span>
                </div>
              </div>
            </div>
            <div className="bg-[#0d0d0d] border border-red-500/20 rounded-2xl p-5 relative" style={{overflowX:"hidden", overflowY:"auto", WebkitOverflowScrolling:"touch", minHeight:"-webkit-fill-available"}}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full blur-2xl" />
              <span className="block text-[8px] tracking-[0.3em] text-red-400/70 mb-2">KRİTİK</span>
              <span className="text-3xl font-light text-white block mb-1">{redAlerts}</span>
              <span className="text-[8px] tracking-[0.2em] text-red-500/60">SÜRESİ DOLMUŞ</span>
            </div>
            <div className="bg-[#0d0d0d] border border-amber-500/20 rounded-2xl p-5 relative" style={{overflowX:"hidden", overflowY:"auto", WebkitOverflowScrolling:"touch", minHeight:"-webkit-fill-available"}}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl" />
              <span className="block text-[8px] tracking-[0.3em] text-amber-400/70 mb-2">DİKKAT</span>
              <span className="text-3xl font-light text-white block mb-1">{yellowWarnings}</span>
              <span className="text-[8px] tracking-[0.2em] text-amber-500/60">YAKLAŞIYOR</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[9px] tracking-[0.35em] text-neutral-600 uppercase">Bekleyen İşlemler</span>
              <div className="flex-1 h-[1px] bg-white/[0.04]" />
              {alerts.length > 0 && <span className="text-[8px] text-neutral-700">{alerts.length}</span>}
            </div>
            {alerts.length === 0 ? (
              <div className="text-center py-12 bg-[#0d0d0d] border border-white/[0.07] rounded-2xl">
                <p className="text-neutral-700 text-[9px] tracking-[0.3em] uppercase">Tüm Belgeler Geçerli ✓</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {alerts.map(alert => (
                  <Link key={alert.id} to={`/vehicles/${alert.vehicleCategory === "Yönetim" ? "yonetim" : "ticari"}/${alert.vehicleId}`}
                    className="block bg-[#0d0d0d] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-4 relative overflow-hidden transition-all">
                    <div className={`absolute left-0 top-0 w-0.5 h-full rounded-l-2xl ${alert.status === "expired" ? "bg-red-500" : "bg-amber-500"}`} />
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="bg-white text-black px-2 py-0.5 text-[9px] font-bold tracking-widest rounded-sm">{alert.licensePlate}</span>
                        <span className="text-xs font-light text-neutral-300">{alert.vehicleName}</span>
                      </div>
                      {alert.status === "expired"
                        ? <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-[8px]"><AlertCircle className="w-2.5 h-2.5" /> SÜRESİ DOLMUŞ</span>
                        : <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[8px]"><AlertTriangle className="w-2.5 h-2.5" /> YAKLAŞIYOR</span>
                      }
                    </div>
                    <div className="flex gap-4">
                      <div><span className="text-[8px] text-neutral-700 tracking-widest">TÜR</span><p className="text-[10px] text-neutral-400 mt-0.5">{alert.type}</p></div>
                      <div><span className="text-[8px] text-neutral-700 tracking-widest">TARİH</span><p className="text-[10px] text-neutral-400 mt-0.5">{formatTR(alert.date)}</p></div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
