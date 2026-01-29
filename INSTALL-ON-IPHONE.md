# 📱 Install Chakra Sound Meditation on Your iPhone

## ⚡ Quick Start (3 Steps!)

### STEP 1: Generate App Icons (Do This Once)

1. **In your browser, go to:**
   ```
   your-app-url/generate-icons.html
   ```
   (Replace `your-app-url` with where your app is hosted)

2. **Click the button:** "⬇️ Download Both Icons"

3. **You'll get two files:**
   - `icon-192.png`
   - `icon-512.png`

4. **Place both files in your `/public/` folder**

> **Note:** If you're using Figma Make, you can skip the icon generation for now and just test the app. The icons are only needed for the app icon on your home screen to look nice!

---

### STEP 2: Deploy Your App

Your app needs to be hosted online for iPhone installation. Options:

**Option A: Figma Make (Easiest)**
- Your app is already hosted at your Figma Make URL
- No deployment needed!
- URL looks like: `https://your-project.figmake.com`

**Option B: Vercel (Free)**
```bash
npm run build
npx vercel
```

**Option C: Netlify (Free)**
- Drag and drop your `dist` folder to netlify.com

---

### STEP 3: Install on iPhone

1. **Open Safari** on your iPhone
   - Must use Safari (Chrome won't work for iOS PWA installation!)

2. **Go to your app URL**
   - Example: `https://your-project.figmake.com`

3. **Tap the Share button** (square with arrow pointing up)
   - It's at the bottom of the screen in Safari

4. **Scroll down and tap "Add to Home Screen"**

5. **Tap "Add"** in the top right

6. **Done!** 🎉
   - Your app icon will appear on your home screen
   - Open it like any other app
   - It runs in full-screen mode (no browser UI)

---

## ✅ What Works Offline:

✅ The app interface and controls  
✅ The mandala controller  
✅ All UI elements  
✅ Service worker caches everything  

⚠️ **Audio files require internet** (they're loaded from Dropbox)

This is normal! Most meditation apps stream audio.

---

## 🎵 Full Offline Mode (Advanced)

If you want the app to work 100% offline including audio:

1. Export your project from Figma Make
2. Add audio files locally to `/public/audio/` folders
3. Change `USE_EXTERNAL_URLS = false` in `/src/config/audioConfig.ts`
4. Deploy to your own hosting

See `/START-HERE-AUDIO-GUIDE.md` for details.

---

## 🧪 Testing Before Installing

Before installing on iPhone, test these:

### On Desktop:
1. Open your app URL in Chrome
2. Press F12 (Developer Tools)
3. Click "Application" tab
4. Check "Service Worker" - should show "activated and running"
5. Check "Manifest" - should show your app details

### On iPhone (Safari):
1. Open your app URL
2. Test that audio plays
3. Test chakra switching
4. Test the mandala controller

If everything works, you're ready to install!

---

## 📱 What You'll See After Installation:

✨ **App Icon:** Beautiful chakra mandala on your home screen  
✨ **No Browser UI:** Full-screen app experience  
✨ **Splash Screen:** When opening the app (iOS built-in)  
✨ **Fast Loading:** Service worker caches everything  
✨ **Works Like Native:** Feels like a real iOS app  

---

## 🆘 Troubleshooting

**"Add to Home Screen" option is grayed out:**
- Make sure you're using Safari (not Chrome)
- Make sure you're on the actual website (not localhost)

**App icon looks generic:**
- You need to generate and add the icon files (Step 1)
- The app will still work, just won't have a pretty icon

**Audio doesn't play:**
- Check that your Dropbox links are still valid
- Make sure you allow audio permissions
- Try tapping the play button twice

**App doesn't install:**
- Make sure the app is deployed online (not localhost)
- Clear Safari cache and try again
- Restart your iPhone

**No sound after installing:**
- First time: Tap anywhere on the screen, then tap play
- iOS requires user interaction before playing audio
- This is normal iOS behavior for web apps

---

## 🎉 You're Done!

Once installed, your app:
- ✅ Opens in full-screen mode
- ✅ Has a beautiful icon on your home screen
- ✅ Loads instantly (cached by service worker)
- ✅ Plays your chakra meditation sounds
- ✅ Works with the mandala controller
- ✅ Includes auto-mix feature
- ✅ Perfect for meditation sessions!

Enjoy your meditative sound journey! 🧘‍♀️✨
