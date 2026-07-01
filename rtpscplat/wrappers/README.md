# Wrapper Packaging Scaffold

This folder contains packaging notes and starter files for wrapping the ROSS TAX PRO workspace as:
- an Android / Google Play Store app wrapper
- a Windows / Microsoft Store desktop wrapper

## Suggested approach

### Android wrapper
- Use Capacitor or Cordova
- Point the app to the existing local web experience
- Add app icons, splash screen, and Play Store metadata

### Windows wrapper
- Use Tauri or Electron
- Package the web app as a desktop shell
- Add installer metadata and Windows-specific branding
