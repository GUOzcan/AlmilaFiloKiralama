import { supabase } from '../lib/supabase'

export type StatusType = "valid" | "warning" | "expired"

export interface Vehicle {
  id: string
  category: "Yönetim" | "Ticari"
  owner?: string
  registrationOwner?: string
  licensePlate: string
  brand?: string
  model: string
  modelYear?: number
  engine?: string
  horsepower?: number
  fuel?: string
  transmission?: string
  color?: string
  mileage?: number
  sigorta: { status: StatusType; date?: string; amount?: number; institution?: string }
  kasko: { status: StatusType; date?: string; amount?: number; institution?: string }
  mtv: { status: StatusType; date?: string; amount?: number }
  muayene: { status: StatusType; date?: string }
}

export interface Alert {
  id: string
  vehicleId: string
  vehicleName: string
  licensePlate: string
  type: "Sigorta" | "Kasko" | "MTV" | "Muayene"
  date: string
  status: StatusType
}

// Supabase row → Vehicle
function rowToVehicle(row: any): Vehicle {
  return {
    id: row.id,
    category: row.category,
    licensePlate: row.license_plate,
    brand: row.brand,
    model: row.model,
    modelYear: row.model_year,
    engine: row.engine,
    horsepower: row.horsepower,
    fuel: row.fuel,
    transmission: row.transmission,
    color: row.color,
    mileage: row.mileage,
    owner: row.owner,
    registrationOwner: row.registration_owner,
    sigorta: { status: row.sigorta_status, date: row.sigorta_date, amount: row.sigorta_amount, institution: row.sigorta_institution },
    kasko: { status: row.kasko_status, date: row.kasko_date, amount: row.kasko_amount, institution: row.kasko_institution },
    mtv: { status: row.mtv_status, date: row.mtv_date, amount: row.mtv_amount },
    muayene: { status: row.muayene_status, date: row.muayene_date },
  }
}

// Vehicle → Supabase row
function vehicleToRow(v: Omit<Vehicle, 'id'>) {
  return {
    category: v.category,
    license_plate: v.licensePlate,
    brand: v.brand || null,
    model: v.model,
    model_year: v.modelYear || null,
    engine: v.engine || null,
    horsepower: v.horsepower || null,
    fuel: v.fuel || null,
    transmission: v.transmission || null,
    color: v.color || null,
    mileage: v.mileage || null,
    owner: v.owner || null,
    registration_owner: v.registrationOwner || null,
    sigorta_status: v.sigorta.status,
    sigorta_date: v.sigorta.date || null,
    sigorta_amount: v.sigorta.amount || null,
    sigorta_institution: v.sigorta.institution || null,
    kasko_status: v.kasko.status,
    kasko_date: v.kasko.date || null,
    kasko_amount: v.kasko.amount || null,
    kasko_institution: v.kasko.institution || null,
    mtv_status: v.mtv.status,
    mtv_date: v.mtv.date || null,
    mtv_amount: v.mtv.amount || null,
    muayene_status: v.muayene.status,
    muayene_date: v.muayene.date || null,
  }
}

export async function loadVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: true })
  if (error) { console.error(error); return [] }
  return data.map(rowToVehicle)
}

export async function addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle | null> {
  const { data, error } = await supabase.from('vehicles').insert(vehicleToRow(vehicle)).select().single()
  if (error) { console.error(error); return null }
  return rowToVehicle(data)
}

export async function updateVehicle(vehicle: Vehicle): Promise<void> {
  const { error } = await supabase.from('vehicles').update(vehicleToRow(vehicle)).eq('id', vehicle.id)
  if (error) console.error(error)
}

export async function deleteVehicle(id: string): Promise<void> {
  const { error } = await supabase.from('vehicles').delete().eq('id', id)
  if (error) console.error(error)
}

export function generateAlerts(vehicleList: Vehicle[]): Alert[] {
  return vehicleList
    .flatMap((vehicle) => {
      const alerts: Alert[] = []
      const check = (type: "Sigorta" | "Kasko" | "MTV" | "Muayene", doc: { status: StatusType; date?: string }) => {
        if ((doc.status === "expired" || doc.status === "warning") && doc.date) {
          alerts.push({ id: `${vehicle.id}-${type}`, vehicleId: vehicle.id, vehicleName: `${vehicle.brand || ""} ${vehicle.model}`.trim(), licensePlate: vehicle.licensePlate, type, date: doc.date, status: doc.status })
        }
      }
      check("Sigorta", vehicle.sigorta)
      check("Kasko", vehicle.kasko)
      check("MTV", vehicle.mtv)
      check("Muayene", vehicle.muayene)
      return alerts
    })
    .sort((a, b) => (a.status === "expired" && b.status !== "expired" ? -1 : 1))
}
