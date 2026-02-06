# 🎵 SIMPLE AUDIO SETUP GUIDE - Start Here!

## ⚠️ IMPORTANT: You DON'T upload to Figma!

Your audio files need to be added to **your project folder on your computer**.

---

## 📁 Where Your Audio Files Go

I've already created the folders for you! Look in your project:

```
/public/audio/
├── 1/  ← ROOT CHAKRA - put 9 MP3s here
├── 2/  ← SACRAL CHAKRA - put 9 MP3s here
├── 3/  ← SOLAR PLEXUS - put 9 MP3s here
├── 4/  ← HEART CHAKRA - put 9 MP3s here
├── 5/  ← THROAT CHAKRA - put 9 MP3s here
├── 6/  ← THIRD EYE - put 9 MP3s here
└── 7/  ← CROWN CHAKRA - put 9 MP3s here
```

---

## 🚀 STEP-BY-STEP (3 Steps Total)

### STEP 1: Download Your Audio from Dropbox
1. Go to your Dropbox where you have all 63 audio files
2. Download ALL of them to your computer
3. Organize them by chakra (you should have 7 groups of 9 files each)

### STEP 2: Add Files to Project Folders

**For EACH chakra (1 through 7):**

1. Go to folder: `/public/audio/1/` (or 2, 3, 4, 5, 6, 7)
2. Take the 9 audio files for that chakra
3. **Rename them to:** `track-1.mp3`, `track-2.mp3`, ... `track-9.mp3`
4. Drop/copy them into the folder
5. Delete the `PUT-AUDIO-FILES-HERE.txt` file

**IMPORTANT:** The files MUST be named exactly:
- `track-1.mp3`
- `track-2.mp3`
- `track-3.mp3`
- `track-4.mp3`
- `track-5.mp3`
- `track-6.mp3`
- `track-7.mp3`
- `track-8.mp3`
- `track-9.mp3`

(lowercase, with dash, .mp3 extension)

### STEP 3: Turn On Local Audio Mode

Open this file: `/src/config/audioConfig.ts`

At the very bottom, change this line:
```typescript
export const USE_EXTERNAL_URLS = true;
```

To this:
```typescript
export const USE_EXTERNAL_URLS = false;
```

---

## ✅ That's It! You're Done!

Your app will now:
- ✅ Load audio files from your local project
- ✅ Work offline after first load
- ✅ No more Dropbox needed
- ✅ No CORS errors

---

## 🧪 How to Test

1. Save all your changes
2. In your terminal, run: `npm run dev`
3. Open the app in your browser
4. Select a chakra
5. Press play - you should hear your audio!

---

## 📤 When You're Ready to Deploy

After adding all your audio files:

1. Build the app: `npm run build`
2. Deploy to Vercel/Netlify (see `/PWA-DEPLOYMENT-GUIDE.md`)
3. Your deployed app will include all the audio files
4. Users can install it as a PWA on their phones

---

## 🤔 Still Confused?

**Think of it like this:**

Your Figma Make project is like a folder on your computer. Inside that folder is a `/public/audio/` folder. You're just putting MP3 files into subfolders (1, 2, 3, 4, 5, 6, 7) so the app can find them.

**You're NOT uploading to Figma's website** - you're adding files to your local project, then when you deploy, those files go with the app.

---

## 📊 Quick Checklist

- [ ] Downloaded all 63 MP3 files from Dropbox
- [ ] Renamed them to `track-1.mp3` through `track-9.mp3` for each chakra
- [ ] Placed 9 files in `/public/audio/1/` (Root Chakra)
- [ ] Placed 9 files in `/public/audio/2/` (Sacral Chakra)
- [ ] Placed 9 files in `/public/audio/3/` (Solar Plexus)
- [ ] Placed 9 files in `/public/audio/4/` (Heart Chakra)
- [ ] Placed 9 files in `/public/audio/5/` (Throat Chakra)
- [ ] Placed 9 files in `/public/audio/6/` (Third Eye)
- [ ] Placed 9 files in `/public/audio/7/` (Crown Chakra)
- [ ] Changed `USE_EXTERNAL_URLS = false` in audioConfig.ts
- [ ] Tested the app locally
- [ ] Ready to deploy!

---

## 🆘 Need Help?

If you're still stuck, let me know which step is confusing and I'll help clarify!
