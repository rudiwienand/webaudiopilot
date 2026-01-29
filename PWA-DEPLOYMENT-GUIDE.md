# PWA Deployment Guide - Chakra Sound Meditation

## ✨ What's Been Set Up

Your app is now a **Progressive Web App (PWA)** with:

✅ **Installable** - Can be added to home screen on mobile devices  
✅ **Full-screen mode** - Opens without browser UI  
✅ **Service Worker** - Caches assets for better performance  
✅ **App manifest** - Provides metadata for installation  
✅ **iOS optimized** - Special meta tags for iPhone/iPad  

## 📱 How to Install on iPhone

### Current Setup (Web Version):
1. Deploy your app to a hosting service (see deployment options below)
2. Open the deployed URL in **Safari** on your iPhone
3. Tap the **Share** button (square with arrow pointing up)
4. Scroll down and tap **"Add to Home Screen"**
5. Choose a name and tap **"Add"**
6. The app icon will appear on your home screen!

### Opening the Installed App:
- Tap the icon on your home screen
- The app opens in full-screen mode (no Safari UI)
- Looks and feels like a native app!

## 🎨 Required Icons

Before deploying, you need to create two app icons:

**Files needed in `/public/` folder:**
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

**How to create icons:**
1. Visit: https://www.pwabuilder.com/imageGenerator
2. Upload a square meditation/chakra themed image (512x512px minimum)
3. Download the generated icons
4. Place them in `/public/` folder

**Icon design ideas:**
- Mandala pattern with 7 chakra colors
- Om symbol (ॐ) in purple/indigo gradient
- Lotus flower design
- Seven chakra symbols arranged in a circle

See `/public/icon-generation-guide.md` for more details.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Free & Easy)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

**Benefits:**
- Free for personal projects
- Automatic HTTPS
- Fast global CDN
- Easy to update (just run `vercel` again)

### Option 2: Netlify (Free)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod
```

### Option 3: GitHub Pages (Free)
1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. Build and deploy to `gh-pages` branch

### Build Command:
```bash
npm run build
```

## 🎵 Audio Files Setup

### Current Setup:
- Audio files are currently hosted on **Dropbox**
- Requires **internet connection** to play
- ✅ Works for web deployment
- ⚠️ May have CORS issues on some browsers

### To Enable Offline Audio:

#### Step 1: Organize Audio Files
Download all your MP3 files and organize them like this:

```
/public/audio/
├── 1/  (Root Chakra)
│   ├── track-1.mp3
│   ├── track-2.mp3
│   ├── ... (9 tracks total)
├── 2/  (Sacral Chakra)
│   └── ... (9 tracks)
├── 3/  (Solar Plexus)
│   └── ... (9 tracks)
├── 4/  (Heart)
│   └── ... (9 tracks)
├── 5/  (Throat)
│   └── ... (9 tracks)
├── 6/  (Third Eye)
│   └── ... (9 tracks)
└── 7/  (Crown)
    └── ... (9 tracks)
```

#### Step 2: Update Configuration
In `/src/config/audioConfig.ts`, change:
```typescript
export const USE_EXTERNAL_URLS = true;
```
To:
```typescript
export const USE_EXTERNAL_URLS = false;
```

#### Step 3: Rebuild and Deploy
```bash
npm run build
# Then deploy using your chosen method
```

**Note:** With local audio files:
- ✅ Works completely offline after first load
- ✅ No CORS issues
- ⚠️ Larger download size (~600MB for all files)
- ⚠️ First load takes longer

See `/public/audio/SETUP-INSTRUCTIONS.md` for detailed instructions.

## 🔧 Testing Your PWA

### Test Locally:
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Test Service Worker:
1. Build the production version: `npm run build`
2. Serve the build folder with a local server
3. Open DevTools → Application → Service Workers
4. Verify service worker is registered

### Test on iPhone:
1. Deploy to a public URL (Vercel/Netlify)
2. Visit URL in Safari on your iPhone
3. Check that "Add to Home Screen" works
4. Test the installed app

## 📋 Pre-Deployment Checklist

- [ ] Create and add `icon-192.png` to `/public/`
- [ ] Create and add `icon-512.png` to `/public/`
- [ ] Decide on audio hosting strategy (Dropbox or local)
- [ ] If using local audio, organize files in `/public/audio/`
- [ ] Test the app locally
- [ ] Choose a deployment platform
- [ ] Build the production version: `npm run build`
- [ ] Deploy to hosting service
- [ ] Test on iPhone Safari
- [ ] Add to home screen and verify it works

## 🎯 What Happens After Installation

**First Time:**
- User visits your deployed URL in Safari
- Adds to home screen
- Service worker installs
- Static assets are cached
- Audio files load on demand (and cache for offline use)

**Subsequent Uses:**
- Tap app icon on home screen
- Opens in full-screen (no browser UI)
- Static UI loads instantly from cache
- Audio files:
  - **Dropbox mode**: Requires internet
  - **Local mode**: Works offline after first load

## 🔍 Troubleshooting

### Service Worker Not Registering:
- Must use HTTPS (or localhost for testing)
- Check browser console for errors
- Clear browser cache and try again

### Icons Not Showing:
- Make sure files are named exactly `icon-192.png` and `icon-512.png`
- Files must be in `/public/` folder
- Clear browser cache and reinstall

### Audio Not Playing on iPhone:
- iOS requires user interaction before playing audio
- Make sure to tap "Play" button
- Check Safari console for errors

### App Not Updating After Changes:
- Increment version in `/public/service-worker.js`
- Change `CACHE_NAME` to force update
- Or uninstall and reinstall the app

## 📚 Additional Resources

- [PWA Builder](https://www.pwabuilder.com/) - Generate icons and test PWA
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Apple iOS Web App Meta Tags](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)

## 🎉 You're Ready!

Your Chakra Sound Meditation app is now set up as a fully installable PWA! Just create your icons, deploy to a hosting service, and share the URL with your users. They can install it on their iPhones and enjoy a native-app-like meditation experience! 🧘‍♀️✨
