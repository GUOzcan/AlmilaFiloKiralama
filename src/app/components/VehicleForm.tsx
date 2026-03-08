import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router"
import { loadVehicles, addVehicle, updateVehicle, Vehicle, StatusType } from "../data/vehicleData"
import { ArrowLeft, Check } from "lucide-react"
import { motion } from "motion/react"

const emptyDoc = { status: "valid" as StatusType }

export function VehicleForm() {
  const { category, id } = useParams<{ category: string; id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id && id !== "add"
  const categoryKey = (category === "yonetim" ? "Yönetim" : "Ticari") as "Yönetim" | "Ticari"

  const [formData, setFormData] = useState<Partial<Vehicle>>({
    category: categoryKey, licensePlate: "", model: "",
    sigorta: emptyDoc, kasko: emptyDoc, mtv1: emptyDoc, mtv2: emptyDoc, muayene: emptyDoc,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (isEdit) {
      loadVehicles().then(all => {
        const v = all.find(v => v.id === id)
        if (v) setFormData(v)
        setLoading(false)
      })
    }
  }, [id, isEdit])

  const handleSubmit = async () => {
    if (!formData.licensePlate || !formData.model) { alert("Plaka ve Model zorunludur."); return }
    setSaving(true)
    const vehicleData = {
      ...formData, category: categoryKey,
      sigorta: formData.sigorta || emptyDoc,
      kasko: formData.kasko || emptyDoc,
      mtv1: formData.mtv1 || emptyDoc,
      mtv2: formData.mtv2 || emptyDoc,
      muayene: formData.muayene || emptyDoc,
    } as Omit<Vehicle, "id">

    if (isEdit && formData.id) {
      await updateVehicle({ ...vehicleData, id: formData.id })
    } else {
      await addVehicle(vehicleData)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => navigate(`/vehicles/${category}`), 800)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-5 h-5 border border-red-500/40 border-t-red-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans pb-28 relative overflow-hidden">
      <div className="sticky top-0 z-20 bg-[#080808]/85 backdrop-blur-xl border-b border-white/[0.06] px-5 py-4 flex items-center justify-between">
        <Link to={isEdit ? `/vehicles/${category}/${id}` : `/vehicles/${category}`}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.08] text-neutral-400 hover:text-white transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="text-[10px] tracking-[0.35em] text-neutral-500 uppercase">{isEdit ? "DÜZENLE" : "YENİ ARAÇ"}</span>
        <button onClick={handleSubmit}
          className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${saved ? "bg-emerald-500 border-emerald-500" : "border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white"}`}>
          <Check className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-5">
        <FormSection title="ARAÇ BİLGİLERİ">
          <FormField label="PLAKA *" value={formData.licensePlate || ""} onChange={v => setFormData({ ...formData, licensePlate: v.toUpperCase() })} placeholder="06 ABC 123" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="MARKA" value={formData.brand || ""} onChange={v => setFormData({ ...formData, brand: v })} placeholder="Mercedes-Benz" />
            <FormField label="MODEL *" value={formData.model || ""} onChange={v => setFormData({ ...formData, model: v })} placeholder="E 200" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="MODEL YILI" type="number" value={formData.modelYear?.toString() || ""} onChange={v => setFormData({ ...formData, modelYear: v ? parseInt(v) : undefined })} placeholder="2023" />
            <FormField label="RENK" value={formData.color || ""} onChange={v => setFormData({ ...formData, color: v })} placeholder="Siyah" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="MOTOR" value={formData.engine || ""} onChange={v => setFormData({ ...formData, engine: v })} placeholder="2.0L" />
            <FormField label="BEYGİR" type="number" value={formData.horsepower?.toString() || ""} onChange={v => setFormData({ ...formData, horsepower: v ? parseInt(v) : undefined })} placeholder="150" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="YAKIT" value={formData.fuel || ""} onChange={v => setFormData({ ...formData, fuel: v })} options={["", "Benzin", "Dizel", "Hibrit", "Elektrik", "LPG"]} />
            <FormSelect label="VİTES" value={formData.transmission || ""} onChange={v => setFormData({ ...formData, transmission: v })} options={["", "Otomatik", "Manuel", "Yarı Otomatik"]} />
          </div>
          <FormField label="KİLOMETRE" type="number" value={formData.mileage?.toString() || ""} onChange={v => setFormData({ ...formData, mileage: v ? parseInt(v) : undefined })} placeholder="15000" />
        </FormSection>

        <FormSection title="SAHİPLİK">
          <FormField label="ARAÇ SAHİBİ" value={formData.owner || ""} onChange={v => setFormData({ ...formData, owner: v })} placeholder="Ahmet Yılmaz" />
          <FormField label="RUHSAT SAHİBİ" value={formData.registrationOwner || ""} onChange={v => setFormData({ ...formData, registrationOwner: v })} placeholder="Almila Grup A.Ş." />
        </FormSection>

        <DocSection
          title="SİGORTA"
          note="Poliçe bitiş tarihini gir"
          data={formData.sigorta!}
          onChange={d => setFormData({ ...formData, sigorta: d })}
          showAmount showInstitution
        />
        <DocSection
          title="KASKO"
          note="Poliçe bitiş tarihini gir"
          data={formData.kasko!}
          onChange={d => setFormData({ ...formData, kasko: d })}
          showAmount showInstitution
        />
        <DocSection
          title="MTV 1. TAKSİT"
          note="Son ödeme: 31 Ocak"
          data={formData.mtv1!}
          onChange={d => setFormData({ ...formData, mtv1: d })}
          showAmount
        />
        <DocSection
          title="MTV 2. TAKSİT"
          note="Son ödeme: 31 Temmuz"
          data={formData.mtv2!}
          onChange={d => setFormData({ ...formData, mtv2: d })}
          showAmount
        />
        <DocSection
          title="MUAYENE"
          note={`Son muayene tarihini gir (${categoryKey === 'Ticari' ? 'ticari=1 yıl' : 'binek=2 yıl'})`}
          data={formData.muayene!}
          onChange={d => setFormData({ ...formData, muayene: d })}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 p-5 bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent pointer-events-none flex justify-center"
        style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
        <motion.button onClick={handleSubmit} whileTap={{ scale: 0.97 }}
          className={`pointer-events-auto w-full max-w-sm py-4 rounded-2xl flex items-center justify-center gap-2.5 text-[11px] font-medium tracking-[0.3em] uppercase transition-all ${
            saved ? "bg-emerald-500 text-white" : saving ? "bg-red-800 text-white" : "bg-red-600 hover:bg-red-500 text-white shadow-[0_4px_30px_rgba(220,38,38,0.25)]"
          }`}>
          {saved ? <><Check className="w-4 h-4" /> KAYDEDİLDİ</> : saving ? "KAYDEDİLİYOR..." : isEdit ? "GÜNCELLE" : "KAYDET"}
        </motion.button>
      </div>
    </div>
  )
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0d0d0d] border border-white/[0.07] rounded-2xl p-5 space-y-4">
      <p className="text-[9px] tracking-[0.35em] text-red-500/80 uppercase">{title}</p>
      {children}
    </div>
  )
}

function DocSection({ title, note, data, onChange, showAmount = false, showInstitution = false }: {
  title: string; note?: string
  data: { status: StatusType; date?: string; amount?: number; institution?: string }
  onChange: (d: any) => void; showAmount?: boolean; showInstitution?: boolean
}) {
  return (
    <div className="bg-[#0d0d0d] border border-white/[0.07] rounded-2xl p-5 space-y-4">
      <div className="flex items-baseline justify-between">
        <p className="text-[9px] tracking-[0.35em] text-red-500/80 uppercase">{title}</p>
        {note && <p className="text-[8px] text-neutral-600">{note}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="YAPILIŞ / ÖDEME TARİHİ" type="date" value={data.date || ""} onChange={v => onChange({ ...data, date: v })} />
        {showAmount && <FormField label="TUTAR (₺)" type="number" value={data.amount?.toString() || ""} onChange={v => onChange({ ...data, amount: v ? parseInt(v) : undefined })} placeholder="5000" />}
      </div>
      {showInstitution && <FormField label="KURUM" value={data.institution || ""} onChange={v => onChange({ ...data, institution: v })} placeholder="Mapfre Sigorta" />}
      <p className="text-[8px] text-neutral-700">Tarih girilince durum otomatik hesaplanır</p>
    </div>
  )
}

function FormField({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-[8px] tracking-[0.3em] text-neutral-600 mb-1.5 uppercase">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-black/40 border border-white/[0.08] rounded-xl text-sm text-white px-3.5 py-2.5 focus:outline-none focus:border-red-500/50 transition-colors placeholder:text-neutral-800" />
    </div>
  )
}

function FormSelect({ label, value, onChange, options, labels }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; labels?: string[]
}) {
  return (
    <div>
      <label className="block text-[8px] tracking-[0.3em] text-neutral-600 mb-1.5 uppercase">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-black/40 border border-white/[0.08] rounded-xl text-sm text-white px-3.5 py-2.5 focus:outline-none focus:border-red-500/50 transition-colors">
        {options.map((opt, i) => <option key={opt} value={opt}>{labels ? labels[i] : opt || "Seçiniz"}</option>)}
      </select>
    </div>
  )
}
