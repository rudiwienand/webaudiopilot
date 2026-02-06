# Audio Setup Guide for Chakra Meditation App

## Why Can't I Upload Audio Files Here?

Figma Make is a web-based environment that doesn't support uploading binary files like MP3s. However, you have **two great options** to integrate your audio files:

---

## ✅ Option 1: Use External URLs (Recommended for Figma Make)

Host your audio files online and link to them. This is the easiest way to integrate audio while using Figma Make.

### Step-by-Step:

#### 1. Upload Your Audio Files to a Hosting Service

Choose one of these options:

**Dropbox (Easy)**
- Upload your MP3 files to Dropbox
- Right-click each file → Share → Create link
- Change the `dl=0` at the end of the URL to `dl=1` to make it a direct download link
- Example: `https://www.dropbox.com/s/abc123/track1.mp3?dl=1`

**Google Drive**
- Upload files to Google Drive
- Right-click → Get link → Set to "Anyone with the link"
- Use a tool like [Direct Link Generator](https://www.wonderplugin.com/online-tools/google-drive-direct-link-generator/)
- Example: `https://drive.google.com/uc?export=download&id=FILE_ID`

**GitHub (For developers)**
- Create a public GitHub repository
- Upload audio files to a folder like `/audio`
- Use raw GitHub URLs: `https://raw.githubusercontent.com/username/repo/main/audio/track1.mp3`

**AWS S3, Cloudinary, or any CDN**
- Upload to your preferred CDN
- Get the public URL for each file

#### 2. Configure the Audio URLs

Edit the file `/src/config/audioConfig.ts`:

```typescript
export const audioConfig: AudioConfig = {
  1: { // Root Chakra
    1: "https://www.dropbox.com/s/abc123/root-track1.mp3?dl=1",
    2: "https://www.dropbox.com/s/def456/root-track2.mp3?dl=1",
    3: "https://www.dropbox.com/s/ghi789/root-track3.mp3?dl=1",
    // ... add URLs for tracks 4-9
  },
  2: { // Sacral Chakra
    1: "https://www.dropbox.com/s/jkl012/sacral-track1.mp3?dl=1",
    // ... etc
  },
  // ... configure all 7 chakras
};
```

#### 3. Enable External URLs

In the same file, change:

```typescript
export const USE_EXTERNAL_URLS = true;
```

#### 4. Test!

Refresh the app and your audio should load from the external URLs.

---

## ✅ Option 2: Download & Run Locally

Download this project and run it on your computer where you can add files directly.

### Step-by-Step:

#### 1. Download the Project

Click the download/export button in Figma Make to get all project files.

#### 2. Extract and Navigate

```bash
cd chakra-meditation-app
```

#### 3. Install Dependencies

```bash
npm install
```

#### 4. Add Your Audio Files

Create the following folder structure in the `/public` directory:

```
/public/audio/
├── chakra-1/
│   ├── track-1.mp3
│   ├── track-2.mp3
│   ├── ... (through track-9.mp3)
├── chakra-2/
│   ├── track-1.mp3
│   ├── ... (through track-9.mp3)
├── chakra-3/
├── chakra-4/
├── chakra-5/
├── chakra-6/
└── chakra-7/
```

#### 5. Ensure Local Files Mode

In `/src/config/audioConfig.ts`, make sure:

```typescript
export const USE_EXTERNAL_URLS = false;
```

#### 6. Run the Development Server

```bash
npm run dev
```

#### 7. Open in Browser

Visit `http://localhost:5173` and your local audio files will play!

---

## Audio File Requirements

- **Format**: MP3 (recommended) or WAV
- **Sample Rate**: 44.1kHz or 48kHz
- **Bit Rate**: 128kbps or higher (for MP3)
- **Duration**: 2-5 minutes recommended (loops automatically)
- **Naming**: Must be exactly `track-1.mp3`, `track-2.mp3`, etc.

---

## Chakra-to-Folder Mapping

- `chakra-1` = Root Chakra (Muladhara) - 194.18Hz
- `chakra-2` = Sacral Chakra (Svadhisthana) - 210.42Hz
- `chakra-3` = Solar Plexus Chakra (Manipura) - 126.22Hz
- `chakra-4` = Heart Chakra (Anahata) - 136.10Hz
- `chakra-5` = Throat Chakra (Vishuddha) - 141.27Hz
- `chakra-6` = Third Eye Chakra (Ajna) - 221.22Hz
- `chakra-7` = Crown Chakra (Sahasrara) - 172.06Hz

---

## Troubleshooting

### CORS Errors with External URLs

If you get CORS errors, your hosting service may not allow cross-origin requests. Try:
- Using Dropbox with `dl=1` parameter
- Using GitHub raw URLs
- Using a CORS-enabled CDN

### Files Not Loading Locally

- Check file names match exactly: `track-1.mp3` (not `Track 1.mp3` or `track1.mp3`)
- Ensure files are in the correct folder structure
- Check browser console for specific error messages

### Audio Stuttering or Quality Issues

- Reduce file sizes by lowering bitrate
- Use MP3 format instead of WAV
- Ensure files aren't corrupted

---

## Need Help?

The app will display helpful error messages if audio files can't be loaded. Check the yellow warning box at the top of the mixer panel for specific guidance.
