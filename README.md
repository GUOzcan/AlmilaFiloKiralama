# Almila Filo Kiralama

Araç filo yönetim uygulaması. PWA destekli — telefona ana ekran uygulaması olarak eklenebilir.

## 🚀 Ücretsiz Deploy (Netlify)

1. https://netlify.com adresine git, ücretsiz hesap aç
2. "Add new site" → "Deploy manually" seç
3. Bu klasörü zip'le ve sürükle bırak
4. **Ya da en kolay yol:** GitHub'a yükle → Netlify ile bağla → otomatik deploy

## 🚀 Alternatif (Vercel)

1. https://vercel.com adresine git
2. "New Project" → klasörü yükle
3. Deploy et → sana özel bir link verir (örn: `almila-filo.vercel.app`)

## 📱 Telefona Yükleme (PWA)

Siteyi telefonunda açtıktan sonra:
- **iPhone (Safari):** "Paylaş" → "Ana Ekrana Ekle"
- **Android (Chrome):** Adres çubuğuna dokun → "Uygulamayı Yükle" / "Ana ekrana ekle"

Artık uygulama gibi açılır, tam ekran, app store yok!

## 💻 Local Geliştirme

```bash
npm install
npm run dev
# Terminalde görünen Network: http://192.168.x.x:5173 adresini telefonundan aç
```

## ✅ Özellikler

- Araç ekleme, düzenleme, silme (Supabase veritabanı ile kalıcı)
- Sigorta / Kasko / MTV / Muayene takibi
- Kontrol paneli — süresi dolmuş belge uyarıları
- Yönetim ve Ticari araç kategorileri
- PWA — telefona uygulama olarak yüklenebilir

## 💾 Otomatik Veri Yedeği (GitHub)

Araç verisi (Supabase `vehicles` tablosu) her hafta otomatik olarak bu repoya
yedeklenir:

- **Dosya:** `data/vehicles-backup.json` — her zaman **tek dosya**, üzerine
  yazılarak güncellenir (haftalık ayrı dosyalar birikmez).
- **Zamanlama:** her Pazartesi 03:00 UTC (`.github/workflows/backup-vehicles.yml`).
- **Elle yedek:** GitHub → **Actions** → "Araç Verisi Yedekle" → **Run workflow**
  (ekleme/silme yaptıktan hemen sonra anında yedek almak için).
- **Değişiklik takibi:** Yedek yalnızca veri gerçekten değiştiğinde commit'lenir;
  eklenen/silinen araçlar git geçmişinde diff olarak görünür.

> Not: Zamanlanmış (haftalık) çalışma yalnızca `main` dalında etkindir. Bu
> nedenle değişikliklerin `main`'e birleştirilmesi gerekir.

Farklı bir Supabase projesi/anahtarı kullanmak istersen, repo
**Settings → Secrets and variables → Actions** altına `SUPABASE_URL` ve
`SUPABASE_KEY` ekle; workflow otomatik olarak onları kullanır.
