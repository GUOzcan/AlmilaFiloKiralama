/**
 * Türkiye araç belge kurallarına göre otomatik status hesaplama
 * 
 * Sigorta: yıllık - tarih bitiş tarihi
 * Kasko: yıllık - tarih bitiş tarihi  
 * MTV: yılda 2 taksit - 31 Ocak ve 31 Temmuz son ödeme
 * Muayene: Binek → 2 yılda bir, Ticari → yılda bir - tarih son muayene tarihi
 */

import { StatusType } from './vehicleData'

const WARNING_DAYS = 30 // 30 gün kala sarı

function daysDiff(targetDate: Date): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  targetDate.setHours(0, 0, 0, 0)
  return Math.floor((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  // Desteklenen formatlar: YYYY-MM-DD, DD.MM.YYYY
  if (dateStr.includes('-')) return new Date(dateStr)
  const parts = dateStr.split('.')
  if (parts.length === 3) return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
  return null
}

function daysToStatus(days: number): StatusType {
  if (days < 0) return 'expired'
  if (days <= WARNING_DAYS) return 'warning'
  return 'valid'
}

/** Sigorta / Kasko: bitiş tarihi girilir, 1 yıllık poliçe */
export function calcSigortaStatus(endDateStr: string): StatusType {
  const endDate = parseDate(endDateStr)
  if (!endDate) return 'valid'
  return daysToStatus(daysDiff(endDate))
}

/** 
 * MTV: ödeme tarihi girilir (31 Ocak veya 31 Temmuz)
 * Girilen tarih son ödeme tarihidir — geçtiyse kırmızı, 30 gün kaldıysa sarı
 */
export function calcMtvStatus(payDateStr: string): StatusType {
  const payDate = parseDate(payDateStr)
  if (!payDate) return 'valid'
  return daysToStatus(daysDiff(payDate))
}

/**
 * Muayene: son muayene tarihi girilir
 * Binek (Yönetim) → 2 yıl sonra dolacak
 * Ticari → 1 yıl sonra dolacak
 */
export function calcMuayeneStatus(lastInspectionDateStr: string, category: 'Yönetim' | 'Ticari'): StatusType {
  const lastDate = parseDate(lastInspectionDateStr)
  if (!lastDate) return 'valid'
  
  const periodYears = category === 'Ticari' ? 1 : 2
  const expiryDate = new Date(lastDate)
  expiryDate.setFullYear(expiryDate.getFullYear() + periodYears)
  
  return daysToStatus(daysDiff(expiryDate))
}

/** 
 * Tüm statüsleri otomatik hesapla ve Supabase'e kaydet 
 * VehicleForm'da kaydetmeden önce çağrılır
 */
export function autoCalculateStatuses(vehicle: any): any {
  const category = vehicle.category as 'Yönetim' | 'Ticari'
  
  return {
    ...vehicle,
    sigorta: {
      ...vehicle.sigorta,
      status: vehicle.sigorta?.date 
        ? calcSigortaStatus(vehicle.sigorta.date) 
        : vehicle.sigorta?.status || 'valid'
    },
    kasko: {
      ...vehicle.kasko,
      status: vehicle.kasko?.date 
        ? calcSigortaStatus(vehicle.kasko.date) 
        : vehicle.kasko?.status || 'valid'
    },
    mtv: {
      ...vehicle.mtv,
      status: vehicle.mtv?.date 
        ? calcMtvStatus(vehicle.mtv.date) 
        : vehicle.mtv?.status || 'valid'
    },
    muayene: {
      ...vehicle.muayene,
      status: vehicle.muayene?.date 
        ? calcMuayeneStatus(vehicle.muayene.date, category) 
        : vehicle.muayene?.status || 'valid'
    }
  }
}
