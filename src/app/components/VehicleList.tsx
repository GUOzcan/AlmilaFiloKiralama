import { Link, useParams } from "react-router"
import { loadVehicles, StatusType } from "../data/vehicleData"
import { ArrowLeft, Plus, ChevronRight } from "lucide-react"
import { motion } from "motion/react"
import { useState, useEffect } from "react"

export function VehicleList() {
  const { category } = useParams<{ category: string }>()
  const categoryName = category === "yonetim" ? "YÖNETİM" : "TİCARİ"
  const categoryKey = category === "yonetim" ? "Yönetim" : "Ticari"

  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVehicles().then(all => {
      setVehicles(all.filter(v => v.category === categoryKey))
      setLoading(false)
    })
  }, [categoryKey])

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "valid": return "bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.5)]"
      case "warning": return "bg-amber-500 shadow-[0_0_6px_rgba(251,191,36,0.5)]"
      case "expired": return "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]"
    }
  }

  const getWorstStatus = (v: any): StatusType => {
    const s = [v.sigorta.status, v.kasko.status, v.muayene.status, v.mtv1?.status || "valid", v.mtv2?.status || "valid"]
    if (s.includes("expired")) return "expired"
    if (s.includes("warning")) return "warning"
    return "valid"
  }

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
  const itemVariants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans pb-20" style={{overflowX:"hidden"}}>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] bg-red-600/[0.03] blur-[80px] pointer-events-none" />

      <div className="fixed top-0 left-0 right-0 z-20 bg-[#080808] border-b border-white/[0.06] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.08] text-neutral-400 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-[11px] tracking-[0.35em] font-light text-white uppercase">{categoryName}</h1>
        </div>
        <Link to={`/vehicles/${category}/add`} className="w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.08] text-neutral-400 hover:text-white hover:border-red-500/40 transition-all group">
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </Link>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 relative z-10" style={{paddingTop:"80px"}}>
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-5 h-5 border border-red-500/40 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : vehicles.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 rounded-full border border-white/[0.06] flex items-center justify-center">
              <Plus className="w-5 h-5 text-neutral-600" />
            </div>
            <p className="text-neutral-600 text-[10px] tracking-[0.3em] uppercase">Kayıtlı Araç Yok</p>
            <Link to={`/vehicles/${category}/add`} className="text-red-500 text-[10px] tracking-[0.2em] uppercase hover:text-white transition-colors">İlk Aracı Ekle</Link>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
            {vehicles.map((vehicle) => {
              const worst = getWorstStatus(vehicle)
              return (
                <motion.div key={vehicle.id} variants={itemVariants}>
                  <Link to={`/vehicles/${category}/${vehicle.id}`} className="group block bg-[#0d0d0d] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 p-4 rounded-2xl relative" style={{overflowX:"hidden"}}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2.5">
                          <span className="inline-block bg-white text-black px-2.5 py-0.5 text-[10px] font-bold tracking-widest rounded-sm flex-shrink-0">{vehicle.licensePlate}</span>
                          <span className="text-sm font-light text-neutral-200 truncate">{vehicle.brand && `${vehicle.brand} `}{vehicle.model}</span>
                        </div>
                        <div className="flex gap-3.5 justify-center mt-1">
                          {[["SİGORTA", vehicle.sigorta.status], ["KASKO", vehicle.kasko.status], ["MUAYENE", vehicle.muayene.status], ["MTV1", vehicle.mtv1?.status || "valid"], ["MTV2", vehicle.mtv2?.status || "valid"]].map(([label, status]) => (
                            <div key={label} className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(status as StatusType)}`} />
                              <span className="text-[8px] tracking-[0.15em] text-neutral-600">{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                        <ChevronRight className="w-4 h-4 text-neutral-700 group-hover:text-neutral-400 transition-colors" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}
