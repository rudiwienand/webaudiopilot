# 🧘‍♀️ Chakra Sound Meditation App

A meditative sound player/mixer with seven chakra levels, beautiful mandala-style controller, and PWA (Progressive Web App) capabilities for iPhone installation.

---

## 🎉 **YOUR APP IS READY TO INSTALL ON iPHONE!**

### ⚡ Quick Start:

1. **Read this first:** [`/YOUR-IPHONE-SETUP-GUIDE.md`](./YOUR-IPHONE-SETUP-GUIDE.md) ⭐

2. **On your iPhone:**
   - Open your app URL in Safari
   - Tap Share → "Add to Home Screen"
   - Done!

---

## 📱 Installation Guides

Choose the guide that fits your needs:

| Guide | When to Use |
|-------|-------------|
| **[YOUR-IPHONE-SETUP-GUIDE.md](./YOUR-IPHONE-SETUP-GUIDE.md)** | 👈 **START HERE!** Simplest path to install |
| [INSTALL-ON-IPHONE.md](./INSTALL-ON-IPHONE.md) | Detailed step-by-step with troubleshooting |
| [COMPLETE-SETUP-CHECKLIST.md](./COMPLETE-SETUP-CHECKLIST.md) | Full technical overview |

---

## ✅ What's Already Done

✅ **PWA Infrastructure**
- Manifest.json configured
- Service worker for offline caching
- iOS-optimized meta tags
- Full-screen app mode

✅ **Audio System**
- 63 audio tracks (9 per chakra × 7 chakras)
- Loading from Dropbox URLs
- Working perfectly!

✅ **Features**
- 7 chakra levels with traditional colors
- 9-pointed mandala controller
- Individual track volume control
- 15-minute auto-mix with smooth transitions
- Randomized movement patterns
- Mobile-optimized touch controls

✅ **Design**
- Calming, meditative interface
- Chakra-specific color schemes
- Sacred geometry patterns
- Responsive mobile layout

---

## 🎨 App Icons (Optional)

To generate beautiful chakra-themed icons:

1. **Go to:** `your-app-url/generate-icons.html`
2. **Download** `icon-192.png` and `icon-512.png`
3. **Place** them in `/public/` folder

Or skip this - the app works fine without custom icons!

---

## 🧩 Features

### 7 Chakra Levels
1. **Root** (Muladhara) - Red
2. **Sacral** (Svadhisthana) - Orange
3. **Solar Plexus** (Manipura) - Yellow
4. **Heart** (Anahata) - Green
5. **Throat** (Vishuddha) - Blue
6. **Third Eye** (Ajna) - Indigo
7. **Crown** (Sahasrara) - Violet

### Sound Mixer
- 9 individual tracks per chakra
- Beautiful mandala controller with 9-pointed star
- Single draggable point controls all volumes
- Based on proximity to each star point

### Auto-Mix Feature
- 15-minute meditation sessions
- Starts and ends in complete silence
- Ultra-smooth fade in/out transitions
- Fully randomized movement patterns
- Organic, unique sessions every time

---

## 🚀 Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **PWA** - Progressive Web App capabilities
- **Service Worker** - Offline caching
- **Web Audio API** - Audio playback

---

## 📂 Project Structure

```
/
├── public/
│   ├── audio/              # Audio folders (7 chakras)
│   ├── manifest.json       # PWA manifest
│   ├── service-worker.js   # Offline caching
│   └── generate-icons.html # Icon generator tool
│
├── src/
│   ├── app/
│   │   ├── App.tsx         # Main component
│   │   └── components/     # UI components
│   ├── hooks/              # Custom React hooks
│   ├── config/             # Audio configuration
│   └── styles/             # CSS styles
│
└── Guides/
    ├── YOUR-IPHONE-SETUP-GUIDE.md  ⭐ START HERE
    ├── INSTALL-ON-IPHONE.md
    └── COMPLETE-SETUP-CHECKLIST.md
```

---

## 🎵 Audio Configuration

Currently using **Dropbox URLs** for audio streaming:

**Pros:**
- ✅ Already working
- ✅ No file management needed
- ✅ Easy to update

**Cons:**
- ⚠️ Requires internet connection
- ⚠️ Links may expire

To switch to local audio files, see: [`/START-HERE-AUDIO-GUIDE.md`](./START-HERE-AUDIO-GUIDE.md)

---

## 🌐 Deployment

### Figma Make (Current)
Your app is already deployed! Just use the current URL.

### Vercel (Alternative)
```bash
npm run build
npx vercel
```

### Netlify (Alternative)
```bash
npm run build
# Upload dist/ folder to netlify.com
```

---

## 📱 iPhone Installation Requirements

1. **MUST use Safari browser** (Chrome won't work for PWA installation)
2. **App must be hosted online** (not localhost)
3. **HTTPS required** (automatically handled by Figma Make/Vercel/Netlify)

---

## 🧪 Testing

### Local Development
```bash
npm install
npm run dev
```

### Before Installing on iPhone
1. Open app in Safari on iPhone
2. Test audio playback
3. Test chakra selection
4. Test mandala controller
5. If everything works → Install it!

---

## 💡 Usage Tips

### First Time on iPhone
1. Tap anywhere on the screen
2. Then tap play button
3. iOS requires user interaction before audio

### Best Experience
- Use headphones/earbuds for immersive sound
- Find a quiet, comfortable space
- Try the auto-mix feature for guided sessions
- Experiment with different chakra combinations

### Privacy
- No data collection
- No analytics
- No account required
- All settings stored locally
- Audio streamed from Dropbox (not downloaded)

---

## 🆘 Troubleshooting

**App won't install on iPhone:**
- Make sure using Safari (not Chrome)
- Make sure on deployed URL (not localhost)
- Clear Safari cache and try again

**Audio doesn't play:**
- Tap screen first, then play
- Check phone isn't on silent
- Verify Dropbox links are valid

**Icons look generic:**
- Generate custom icons using `/generate-icons.html`
- Or leave as-is - functionality unchanged

See full troubleshooting: [INSTALL-ON-IPHONE.md](./INSTALL-ON-IPHONE.md)

---

## 🎯 Quick Links

- **Installation Guide:** [`YOUR-IPHONE-SETUP-GUIDE.md`](./YOUR-IPHONE-SETUP-GUIDE.md)
- **Icon Generator:** `/generate-icons.html` (visit in browser)
- **More Sound Meditations:** https://www.thetuningfork.life/music

---

## 📄 License

This is your personal meditation app. Use and enjoy! 🙏✨

---

## 🧘‍♀️ Enjoy Your Journey

Your chakra sound meditation app is ready to use! Install it on your iPhone and begin your journey to inner peace through sound healing.

**Namaste** 🙏
