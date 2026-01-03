# Google Analytics Setup

## Overview
Google Analytics has been successfully integrated into the Telebox application with the Measurement ID stored securely in environment variables.

## Configuration

### Environment Variables
- **File**: `frontend/.env`
- **Variable**: `VITE_GA_MEASUREMENT_ID=G-ZLQW4HVDF3`

### Files Modified
1. **`frontend/index.html`** - Added Google Analytics tracking script
2. **`frontend/vite.config.ts`** - Added HTML env plugin
3. **`frontend/vite-plugin-html-env.ts`** - Custom Vite plugin for env variable replacement
4. **`frontend/.env.example`** - Added GA measurement ID placeholder

## How It Works

1. The Google Analytics tracking code is added to `index.html` with placeholders (`%VITE_GA_MEASUREMENT_ID%`)
2. During build/dev, the custom Vite plugin (`htmlEnvPlugin`) replaces these placeholders with the actual value from `.env`
3. If the GA ID is not configured or is the default placeholder, the script won't be injected

## Testing

To verify Google Analytics is working:

1. **Restart the dev server** (required for env changes):
   ```bash
   # Stop the current dev server (Ctrl+C)
   npm run dev
   ```

2. **Check the browser console**:
   - Open DevTools → Console
   - Look for Google Analytics debug messages

3. **Use Google Analytics Debugger**:
   - Install the [Google Analytics Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
   - Enable it and reload your page
   - Check console for detailed GA tracking info

4. **Real-time Reports**:
   - Go to [Google Analytics](https://analytics.google.com/)
   - Navigate to Reports → Realtime
   - Visit your website and verify events appear

## Security Notes

- ✅ The `.env` file is gitignored (GA ID won't be committed)
- ✅ The `.env.example` shows developers what variables are needed
- ✅ The GA Measurement ID is safe to expose in client-side code (it's meant to be public)

## Changing the GA Measurement ID

To use a different Google Analytics property:

1. Update `frontend/.env`:
   ```bash
   VITE_GA_MEASUREMENT_ID=G-YOUR-NEW-ID
   ```

2. Restart the dev server

## Production Deployment

For production, ensure your hosting platform has the environment variable set:
- **Vercel**: Add `VITE_GA_MEASUREMENT_ID` in Project Settings → Environment Variables
- **Netlify**: Add in Site Settings → Build & Deploy → Environment Variables
- **Other platforms**: Follow their specific env variable configuration process
