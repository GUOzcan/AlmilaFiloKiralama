import { supabase } from '../lib/supabase'
import { autoCalculateStatuses } from './statusEngine'

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

function rowToVehicle(row: any): Vehicle {
  const raw = {
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
    sigorta: { status: row.sigorta_status as StatusType, date: row.sigorta_date, amount: row.sigorta_amount, institution: row.sigorta_institution },
    kasko: { status: row.kasko_status as StatusType, date: row.kasko_date, amount: row.kasko_amount, institution: row.kasko_institution },
    mtv: { status: row.mtv_status as StatusType, date: row.mtv_date, amount: row.mtv_amount },
    muayene: { status: row.muayene_status as StatusType, date: row.muayene_date },
  }
  // Tarihlere göre statüsü yeniden hesapla (gerçek zamanlı)
  return autoCalculateStatuses(raw) as Vehicle
}

function vehicleToRow(v: Omit<Vehicle, 'id'>) {
  // Kaydetmeden önce statüsleri hesapla
  const calculated = autoCalculateStatuses(v)
  return {
    category: calculated.category,
    license_plate: calculated.licensePlate,
    brand: calculated.brand || null,
    model: calculated.model,
    model_year: calculated.modelYear || null,
    engine: calculated.engine || null,
    horsepower: calculated.horsepower || null,
    fuel: calculated.fuel || null,
    transmission: calculated.transmission || null,
    color: calculated.color || null,
    mileage: calculated.mileage || null,
    owner: calculated.owner || null,
    registration_owner: calculated.registrationOwner || null,
    sigorta_status: calculated.sigorta.status,
    sigorta_date: calculated.sigorta.date || null,
    sigorta_amount: calculated.sigorta.amount || null,
    sigorta_institution: calculated.sigorta.institution || null,
    kasko_status: calculated.kasko.status,
    kasko_date: calculated.kasko.date || null,
    kasko_amount: calculated.kasko.amount || null,
    kasko_institution: calculated.kasko.institution || null,
    mtv_status: calculated.mtv.status,
    mtv_date: calculated.mtv.date || null,
    mtv_amount: calculated.mtv.amount || null,
    muayene_status: calculated.muayene.status,
    muayene_date: calculated.muayene.date || null,
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
          alerts.push({
            id: `${vehicle.id}-${type}`,
            vehicleId: vehicle.id,
            vehicleName: `${vehicle.brand || ""} ${vehicle.model}`.trim(),
            licensePlate: vehicle.licensePlate,
            type, date: doc.date, status: doc.status
          })
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
