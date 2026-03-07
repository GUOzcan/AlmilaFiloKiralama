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

- Araç ekleme, düzenleme, silme (localStorage ile kalıcı)
- Sigorta / Kasko / MTV / Muayene takibi
- Kontrol paneli — süresi dolmuş belge uyarıları
- Yönetim ve Ticari araç kategorileri
- PWA — telefona uygulama olarak yüklenebilir
