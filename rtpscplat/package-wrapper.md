# Wrapper Packaging Plan

## Android / Google Play Store wrapper
- Package the existing web app as a mobile webview shell.
- Use Capacitor or Cordova to wrap the app.
- Configure app icon, splash screen, and Play Store metadata.
- Enable offline-safe shell and local storage for consent/export workflows.

## Windows / Microsoft Store wrapper
- Package the app as a Progressive Web App (PWA) with desktop install support.
- Use Tauri or Electron for a native Windows wrapper.
- Configure app identity, installer, and Microsoft Store metadata.
- Enable local file save and export-ready document handling.
