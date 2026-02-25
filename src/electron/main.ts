import { app, BrowserWindow, desktopCapturer, session, ipcMain } from 'electron';
import path from 'path';

let currentConnectionMode: string = 'browse'; // Default connection mode

// Ignore certificate errors for localhost and local IPs (development only)
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  // Allow localhost and local network IPs with self-signed certificates
  const isLocal = url.includes('localhost') || 
                  url.includes('127.0.0.1') || 
                  url.includes('10.220.79.20') ||
                  /^https?:\/\/(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/.test(url);
  
  if (isLocal) {
    event.preventDefault();
    callback(true);
  } else {
    callback(false);
  }
});

app.on('ready', () => {
    const configuration = {
    width: 600,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(app.getAppPath(), 'dist-electron/preload.cjs'),
    },
  }
  const mainWindow = new BrowserWindow(configuration);

  ipcMain.handle('set-connection-mode', (event, mode: string) => {
    currentConnectionMode = mode;
    console.log(`Set connection mode to ${mode}`);
    // Here you can add any additional logic needed to handle the connection mode change

    return { success: true };
  });

  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
    console.log(`Display media requested, current mode: ${currentConnectionMode}`);
    
    // Control mode: Auto-select first screen
    if (currentConnectionMode === 'control') {
        desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
          // Grant access to the first screen found.
          callback({ video: sources[0], audio: 'loopback' })
        })
    } else if (currentConnectionMode === 'cast') {
      // Cast mode: Use system picker
      desktopCapturer.getSources({ types: ['screen', 'window'] }).then((sources) => {
        // Let user choose, we need to return the sources for the picker
        // Actually, for useSystemPicker, we just need to call callback with empty/undefined
        // to let the system picker handle it
        callback({});
      });
    }
    // Browse mode: getDisplayMedia won't be called at all
  }, { useSystemPicker: true }); // Always use system picker, we control behavior in the handler

  mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
})