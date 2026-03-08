/**
 * Türkiye araç belge kuralları - YAPILIŞ TARİHİ girilir, bitiş otomatik hesaplanır
 *
 * Sigorta   → yapılış tarihi + 1 YIL = bitiş
 * Kasko     → yapılış tarihi + 1 YIL = bitiş
 * MTV 1     → yapılış/ödeme tarihi + 6 AY (Ocak ödemesi Temmuz'a kadar geçerli)
 * MTV 2     → yapılış/ödeme tarihi + 6 AY (Temmuz ödemesi Ocak'a kadar geçerli)
 * Muayene   → yapılış tarihi + 2 YIL (binek) veya + 1 YIL (ticari)
 */

import { StatusType } from './vehicleData'

const WARNING_DAYS = 30 // 30 gün kala sarı

function daysDiff(targetDate: Date): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  targetDate.setHours(0, 0, 0, 0)
  return Math.floor((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  if (dateStr.includes('-')) {
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? null : d
  }
  const parts = dateStr.split('.')
  if (parts.length === 3) {
    const d = new Date(`${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`)
    return isNaN(d.getTime()) ? null : d
  }
  return null
}

function daysToStatus(days: number): StatusType {
  if (days < 0) return 'expired'
  if (days <= WARNING_DAYS) return 'warning'
  return 'valid'
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

function addYears(date: Date, years: number): Date {
  const d = new Date(date)
  d.setFullYear(d.getFullYear() + years)
  return d
}

/** Sigorta: yapılış tarihi + 1 yıl */
export function calcSigortaExpiry(startDateStr: string): Date | null {
  const d = parseDate(startDateStr)
  return d ? addYears(d, 1) : null
}

/** Kasko: yapılış tarihi + 1 yıl */
export function calcKaskoExpiry(startDateStr: string): Date | null {
  const d = parseDate(startDateStr)
  return d ? addYears(d, 1) : null
}

/** MTV: ödeme tarihi + 6 ay (her taksit 6 aylık) */
export function calcMtvExpiry(payDateStr: string): Date | null {
  const d = parseDate(payDateStr)
  return d ? addMonths(d, 6) : null
}

/**
 * Muayene: yapılış tarihi + periyot
 * Binek (Yönetim) → + 2 yıl
 * Ticari          → + 1 yıl
 */
export function calcMuayeneExpiry(inspectionDateStr: string, category: 'Yönetim' | 'Ticari'): Date | null {
  const d = parseDate(inspectionDateStr)
  if (!d) return null
  return category === 'Ticari' ? addYears(d, 1) : addYears(d, 2)
}

/** Bitiş tarihinden StatusType hesapla */
function expiryToStatus(expiry: Date | null): StatusType {
  if (!expiry) return 'valid'
  return daysToStatus(daysDiff(expiry))
}

/** Format: YYYY-MM-DD */
function formatDate(d: Date): string {
  return d.toISOString().split('T')[0]
}

/**
 * Tüm belgelerin statüsünü ve bitiş tarihlerini otomatik hesapla
 * VehicleForm kaydetmeden önce ve loadVehicles'da çağrılır
 */
export function autoCalculateStatuses(vehicle: any): any {
  const category = vehicle.category as 'Yönetim' | 'Ticari'

  const sigortaExpiry = vehicle.sigorta?.date ? calcSigortaExpiry(vehicle.sigorta.date) : null
  const kaskoExpiry  = vehicle.kasko?.date  ? calcKaskoExpiry(vehicle.kasko.date)   : null
  const mtv1Expiry   = vehicle.mtv1?.date   ? calcMtvExpiry(vehicle.mtv1.date)       : null
  const mtv2Expiry   = vehicle.mtv2?.date   ? calcMtvExpiry(vehicle.mtv2.date)       : null
  const muayeneExpiry = vehicle.muayene?.date ? calcMuayeneExpiry(vehicle.muayene.date, category) : null

  return {
    ...vehicle,
    sigorta: {
      ...vehicle.sigorta,
      status: expiryToStatus(sigortaExpiry),
      expiryDate: sigortaExpiry ? formatDate(sigortaExpiry) : undefined,
    },
    kasko: {
      ...vehicle.kasko,
      status: expiryToStatus(kaskoExpiry),
      expiryDate: kaskoExpiry ? formatDate(kaskoExpiry) : undefined,
    },
    mtv1: {
      ...vehicle.mtv1,
      status: expiryToStatus(mtv1Expiry),
      expiryDate: mtv1Expiry ? formatDate(mtv1Expiry) : undefined,
    },
    mtv2: {
      ...vehicle.mtv2,
      status: expiryToStatus(mtv2Expiry),
      expiryDate: mtv2Expiry ? formatDate(mtv2Expiry) : undefined,
    },
    muayene: {
      ...vehicle.muayene,
      status: expiryToStatus(muayeneExpiry),
      expiryDate: muayeneExpiry ? formatDate(muayeneExpiry) : undefined,
    },
  }
}
