# Quick Start Guide

## 🚀 Running WeCall in 5 Minutes

### Step 1: Install Python Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Install Node Dependencies

```bash
cd frontend
npm install
```

### Step 3: Start Backend Server

```bash
cd backend
python run.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 4: Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.0.12  ready in 500 ms
➜  Local:   http://localhost:3000/
```

### Step 5: Open Your Browser

Navigate to: **http://localhost:3000**

## 🎥 Creating Your First Call

1. Click **"Create Room"**
2. (Optional) Enter a room name
3. Click **"Create Room"** button
4. Share the **Room ID** with others
5. Allow camera and microphone permissions
6. Start calling!

## 👥 Joining a Call

1. Click **"Join Room"**
2. Enter the **Room ID** shared with you
3. Click **"Join Room"** button
4. Allow camera and microphone permissions
5. You're in!

## 🎛️ Call Controls

- **Microphone Button**: Click to mute/unmute
- **Camera Button**: Click to turn video on/off
- **Red Phone Button**: Click to leave the call

## 🔧 Troubleshooting

### Camera/Microphone Not Working?

1. Make sure you granted permissions
2. Check your browser settings
3. Try using HTTPS or localhost
4. Check if another app is using your camera

### Cannot Connect to Room?

1. Make sure backend is running on port 8000
2. Check the Room ID is correct (8 characters)
3. Room might be full (max 10 participants)

### No Video Showing?

1. Check your internet connection
2. Try refreshing the page
3. Make sure your firewall isn't blocking WebRTC
4. Check browser console for errors (F12)

## 🌐 Browser Compatibility

✅ Chrome 80+
✅ Firefox 75+
✅ Safari 14+
✅ Edge 80+

## 📱 Mobile Testing

Access from your phone using your computer's IP:

1. Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. On your phone, navigate to: `http://YOUR_IP:3000`
3. Make sure phone and computer are on same network

## 🎓 Next Steps

- Read the full [README.md](../README.md) for architecture details
- Explore the [API Documentation](../README.md#-api-documentation)
- Customize the UI colors and theme
- Deploy to production

---

**Need Help?** Check the main README or open an issue on GitHub!
