import { Link, useParams, useNavigate } from "react-router"
import { loadVehicles, deleteVehicle, StatusType, Vehicle } from "../data/vehicleData"
import { ArrowLeft, Edit2, Trash2, Car, Shield, FileText, Calendar } from "lucide-react"
import { motion } from "motion/react"
import { useState, useEffect } from "react"
import { formatTR } from "../data/statusEngine"

export function VehicleDetail() {
  const { category, id } = useParams<{ category: string; id: string }>()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVehicles().then(all => {
      setVehicle(all.find(v => v.id === id) || null)
      setLoading(false)
    })
  }, [id])

  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case "valid":   return { badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25", bar: "bg-emerald-500", dot: "bg-emerald-500", label: "GEÇERLİ" }
      case "warning": return { badge: "bg-amber-500/15 text-amber-400 border-amber-500/25",       bar: "bg-amber-500",   dot: "bg-amber-500",   label: "YAKLAŞIYOR" }
      case "expired": return { badge: "bg-red-500/15 text-red-400 border-red-500/25",             bar: "bg-red-500",     dot: "bg-red-500",     label: "SÜRESİ DOLMUŞ" }
    }
  }

  const handleDelete = async () => {
    if (!vehicle) return
    if (confirm(`"${vehicle.licensePlate}" plakalı aracı silmek istediğinizden emin misiniz?`)) {
      await deleteVehicle(vehicle.id)
      navigate(`/vehicles/${category}`)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-5 h-5 border border-red-500/40 border-t-red-500 rounded-full animate-spin" />
    </div>
  )

  if (!vehicle) return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center font-sans">
      <div className="text-center">
        <p className="text-neutral-500 tracking-[0.3em] uppercase mb-4 text-xs">Araç Bulunamadı</p>
        <Link to={`/vehicles/${category}`} className="text-red-600 hover:text-white transition-colors uppercase tracking-widest text-xs">GERİ DÖN</Link>
      </div>
    </div>
  )

  const allStatuses = [vehicle.sigorta.status, vehicle.kasko.status, vehicle.muayene.status, vehicle.mtv1?.status || "valid", vehicle.mtv2?.status || "valid"]
  const overallStatus = allStatuses.includes("expired") ? "expired" : allStatuses.includes("warning") ? "warning" : "valid"
  const overallConfig = getStatusConfig(overallStatus)

  const docs = [
    { title: "Sigorta",       status: vehicle.sigorta.status,           date: vehicle.sigorta.date },
    { title: "Kasko",         status: vehicle.kasko.status,             date: vehicle.kasko.date },
    { title: "Muayene",       status: vehicle.muayene.status,           date: vehicle.muayene.date },
    { title: "MTV 1. Taksit", status: vehicle.mtv1?.status || "valid",  date: vehicle.mtv1?.date },
    { title: "MTV 2. Taksit", status: vehicle.mtv2?.status || "valid",  date: vehicle.mtv2?.date },
  ]

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans pb-24 relative" style={{overflowX:"hidden", overflowY:"auto", WebkitOverflowScrolling:"touch", minHeight:"-webkit-fill-available"}}>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-red-600/[0.04] blur-[80px] pointer-events-none" />

      <div className="fixed top-0 left-0 right-0 z-20 bg-[#080808] border-b border-white/[0.06] px-5 py-4 flex items-center justify-between"
        style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
        <Link to={`/vehicles/${category}`} className="w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.08] text-neutral-400 hover:text-white transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="text-[10px] tracking-[0.35em] text-neutral-500 uppercase font-light">Araç Detayı</div>
        <div className="flex gap-2">
          <Link to={`/vehicles/${category}/${id}/edit`} className="w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.08] text-neutral-400 hover:text-white transition-all">
            <Edit2 className="w-4 h-4" />
          </Link>
          <button onClick={handleDelete} className="w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.08] text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 pb-4 relative z-10" style={{paddingTop:"80px"}}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="relative bg-[#0d0d0d] border border-white/[0.07] rounded-2xl p-7 mb-5 overflow-hidden">
          <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 ${overallStatus === 'valid' ? 'bg-emerald-500' : overallStatus === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
          <div className="flex items-center justify-between mb-6">
            <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.3em] text-neutral-500 uppercase"><Car className="w-3 h-3" />{vehicle.category}</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] tracking-[0.2em] border font-medium ${overallConfig.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${overallConfig.dot}`} />{overallConfig.label}
            </span>
          </div>
          <div className="bg-white text-black px-4 py-1.5 text-lg font-bold tracking-[0.15em] rounded-sm shadow-[0_2px_20px_rgba(255,255,255,0.15)] inline-block">
            {vehicle.licensePlate}
          </div>
          <h1 className="text-2xl font-light tracking-wide text-white mt-3">
            {vehicle.brand && <span className="font-medium">{vehicle.brand} </span>}{vehicle.model}
          </h1>
        </motion.div>

        {/* Stat chips: YIL → RENK → YAKIT → VİTES */}
        {(vehicle.modelYear || vehicle.color || vehicle.fuel || vehicle.transmission) && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-4 gap-2 mb-5">
            {vehicle.modelYear    && <StatChip label="YIL"   value={`${vehicle.modelYear}`} />}
            {vehicle.color        && <StatChip label="RENK"  value={vehicle.color} />}
            {vehicle.fuel         && <StatChip label="YAKIT" value={vehicle.fuel} />}
            {vehicle.transmission && <StatChip label="VİTES" value={vehicle.transmission} />}
          </motion.div>
        )}

        {/* Araç Bilgileri: sahip, motor, beygir, km */}
        {(vehicle.owner || vehicle.registrationOwner || vehicle.engine || vehicle.horsepower || vehicle.mileage) && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-[#0d0d0d] border border-white/[0.07] rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-3.5 h-3.5 text-red-500" />
              <span className="text-[9px] tracking-[0.35em] text-neutral-500 uppercase">Araç Bilgileri</span>
            </div>
            <div className="space-y-0.5">
              {vehicle.owner             && <InfoRow label="Araç Sahibi"   value={vehicle.owner} />}
              {vehicle.registrationOwner && <InfoRow label="Ruhsat Sahibi" value={vehicle.registrationOwner} />}
              {vehicle.engine            && <InfoRow label="Motor"         value={`${vehicle.engine} cc`} />}
              {vehicle.horsepower        && <InfoRow label="Beygir Gücü"   value={`${vehicle.horsepower} kw`} />}
              {vehicle.mileage           && <InfoRow label="Kilometre"     value={`${vehicle.mileage.toLocaleString("tr-TR")} km`} />}
            </div>
          </motion.div>
        )}

        {/* Belgeler: Sigorta → Kasko → Muayene */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#0d0d0d] border border-white/[0.07] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-3.5 h-3.5 text-red-500" />
            <span className="text-[9px] tracking-[0.35em] text-neutral-500 uppercase">Belgeler</span>
          </div>
          <div className="space-y-3">
            {docs.map(doc => {
              const cfg = getStatusConfig(doc.status as StatusType)
              return (
                <div key={doc.title} className="flex items-center gap-3 bg-black/30 rounded-xl px-4 py-3 border border-white/[0.04]">
                  <div className={`w-1 h-8 rounded-full ${cfg.bar} opacity-80 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-neutral-200">{doc.title}</span>
                      <span className={`text-[8px] tracking-[0.2em] px-2 py-0.5 rounded-full border ${cfg.badge}`}>{cfg.label}</span>
                    </div>
                    {doc.date && (
                      <span className="text-[10px] text-neutral-600 flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />{formatTR(doc.date)}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0d0d0d] border border-white/[0.07] rounded-xl p-3 flex flex-col items-center gap-1">
      <span className="text-[8px] tracking-[0.25em] text-neutral-600">{label}</span>
      <span className="text-xs font-medium text-neutral-200 truncate w-full text-center">{value}</span>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
      <span className="text-[10px] tracking-[0.15em] text-neutral-600">{label}</span>
      <span className="text-xs text-neutral-300 font-light">{value}</span>
    </div>
  )
}
