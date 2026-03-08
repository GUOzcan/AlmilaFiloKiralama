/**
 * Bitiş tarihi girilir, 45 gün kala sarı, geçtiyse kırmızı, fazlaysa yeşil
 */
import { StatusType } from './vehicleData'

const WARNING_DAYS = 30

function daysDiff(targetDate: Date): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  targetDate.setHours(0, 0, 0, 0)
  return Math.floor((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? null : d
  }
  // DD.MM.YYYY
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('.')
    const d = new Date(`${year}-${month}-${day}`)
    return isNaN(d.getTime()) ? null : d
  }
  return null
}

function daysToStatus(days: number): StatusType {
  if (days < 0) return 'expired'
  if (days <= WARNING_DAYS) return 'warning'
  return 'valid'
}

/** Bitiş tarihini statusType'a çevir */
function expiryToStatus(expiry: Date | null): StatusType {
  if (!expiry) return 'valid'
  return daysToStatus(daysDiff(expiry))
}

/** Tarihi Türkçe GG.AA.YYYY formatına çevir */
export function formatTR(dateStr: string): string {
  const d = parseDate(dateStr)
  if (!d) return dateStr
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

export function autoCalculateStatuses(vehicle: any): any {
  const calcStatus = (dateStr?: string) => expiryToStatus(dateStr ? parseDate(dateStr) : null)

  return {
    ...vehicle,
    sigorta: { ...vehicle.sigorta, status: calcStatus(vehicle.sigorta?.date) },
    kasko:   { ...vehicle.kasko,   status: calcStatus(vehicle.kasko?.date) },
    mtv1:    { ...vehicle.mtv1,    status: calcStatus(vehicle.mtv1?.date) },
    mtv2:    { ...vehicle.mtv2,    status: calcStatus(vehicle.mtv2?.date) },
    muayene: { ...vehicle.muayene, status: calcStatus(vehicle.muayene?.date) },
  }
}
