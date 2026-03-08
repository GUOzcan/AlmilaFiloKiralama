import { supabase } from '../lib/supabase'
import { autoCalculateStatuses } from './statusEngine'

export type StatusType = "valid" | "warning" | "expired"

export interface DocField {
  status: StatusType
  date?: string
  amount?: number
  institution?: string
}

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
  sigorta: DocField
  kasko: DocField
  mtv1: DocField  // 1. taksit - Ocak (31 Ocak son ödeme)
  mtv2: DocField  // 2. taksit - Temmuz (31 Temmuz son ödeme)
  muayene: { status: StatusType; date?: string }
}

export interface Alert {
  id: string
  vehicleId: string
  vehicleName: string
  licensePlate: string
  type: "Sigorta" | "Kasko" | "MTV 1" | "MTV 2" | "Muayene"
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
    mtv1: { status: (row.mtv1_status || 'valid') as StatusType, date: row.mtv1_date, amount: row.mtv1_amount },
    mtv2: { status: (row.mtv2_status || 'valid') as StatusType, date: row.mtv2_date, amount: row.mtv2_amount },
    muayene: { status: row.muayene_status as StatusType, date: row.muayene_date },
  }
  return autoCalculateStatuses(raw) as Vehicle
}

function vehicleToRow(v: Omit<Vehicle, 'id'>) {
  const c = autoCalculateStatuses(v)
  return {
    category: c.category,
    license_plate: c.licensePlate,
    brand: c.brand || null,
    model: c.model,
    model_year: c.modelYear || null,
    engine: c.engine || null,
    horsepower: c.horsepower || null,
    fuel: c.fuel || null,
    transmission: c.transmission || null,
    color: c.color || null,
    mileage: c.mileage || null,
    owner: c.owner || null,
    registration_owner: c.registrationOwner || null,
    sigorta_status: c.sigorta.status,
    sigorta_date: c.sigorta.date || null,
    sigorta_amount: c.sigorta.amount || null,
    sigorta_institution: c.sigorta.institution || null,
    kasko_status: c.kasko.status,
    kasko_date: c.kasko.date || null,
    kasko_amount: c.kasko.amount || null,
    kasko_institution: c.kasko.institution || null,
    mtv_status: c.mtv1.status,   // eski kolon uyumu
    mtv_date: c.mtv1.date || null,
    mtv_amount: c.mtv1.amount || null,
    mtv1_status: c.mtv1.status,
    mtv1_date: c.mtv1.date || null,
    mtv1_amount: c.mtv1.amount || null,
    mtv2_status: c.mtv2.status,
    mtv2_date: c.mtv2.date || null,
    mtv2_amount: c.mtv2.amount || null,
    muayene_status: c.muayene.status,
    muayene_date: c.muayene.date || null,
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
      const check = (type: Alert['type'], doc: { status: StatusType; date?: string }) => {
        if ((doc.status === "expired" || doc.status === "warning") && doc.date) {
          alerts.push({ id: `${vehicle.id}-${type}`, vehicleId: vehicle.id, vehicleName: `${vehicle.brand || ""} ${vehicle.model}`.trim(), licensePlate: vehicle.licensePlate, type, date: doc.date, status: doc.status })
        }
      }
      check("Sigorta", vehicle.sigorta)
      check("Kasko", vehicle.kasko)
      check("MTV 1", vehicle.mtv1)
      check("MTV 2", vehicle.mtv2)
      check("Muayene", vehicle.muayene)
      return alerts
    })
    .sort((a, b) => (a.status === "expired" && b.status !== "expired" ? -1 : 1))
}
