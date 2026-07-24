/**
 * Supabase 'vehicles' tablosunu tek bir JSON dosyasına yedekler:
 *   data/vehicles-backup.json
 *
 * Çıktı deterministiktir (sabit sıralama, oynak zaman damgası yok) — böylece
 * dosya YALNIZCA araç verisi gerçekten değiştiğinde farklılaşır. Git bu
 * değişiklikleri ekleme/silme (diff) olarak kaydeder; her hafta gereksiz
 * tekrar dosya/commit oluşmaz.
 *
 * Ortam değişkenleri:
 *   SUPABASE_URL  - proje URL'i
 *   SUPABASE_KEY  - okuma için anahtar (publishable/anon yeterli)
 */
import { writeFileSync, mkdirSync } from 'node:fs'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_KEY

if (!url || !key) {
  console.error('HATA: SUPABASE_URL ve SUPABASE_KEY ortam değişkenleri gerekli.')
  process.exit(1)
}

const endpoint = `${url.replace(/\/$/, '')}/rest/v1/vehicles?select=*&order=created_at.asc`

const res = await fetch(endpoint, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
})

if (!res.ok) {
  console.error('HATA: Supabase isteği başarısız:', res.status, await res.text())
  process.exit(1)
}

const rows = await res.json()

if (!Array.isArray(rows)) {
  console.error('HATA: Beklenmeyen yanıt (dizi değil).')
  process.exit(1)
}

// Güvenlik freni: tablo beklenmedik şekilde boş dönerse, mevcut yedeğin
// üzerine yazıp veriyi kaybetme riskine karşı dur. (İlk kez boş bir tablo
// yedeklemek istiyorsan ALLOW_EMPTY=1 ver.)
if (rows.length === 0 && process.env.ALLOW_EMPTY !== '1') {
  console.error('UYARI: Tablo boş döndü. Yedek güncellenmedi (ALLOW_EMPTY=1 ile zorlayabilirsin).')
  process.exit(1)
}

mkdirSync('data', { recursive: true })
writeFileSync('data/vehicles-backup.json', JSON.stringify(rows, null, 2) + '\n', 'utf8')

console.log(`Yedeklendi: ${rows.length} araç -> data/vehicles-backup.json`)
