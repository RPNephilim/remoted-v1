import { app, BrowserWindow, desktopCapturer, session, ipcMain } from 'electron';
import path from 'path';

let currentConnectionMode: string = 'browse'; // Default connection mode

app.on('ready', () => {
    const configuration = {
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
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
    // Control mode: Auto-select first screen
    if (currentConnectionMode === 'control') {
        desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
          // Grant access to the first screen found.
          callback({ video: sources[0], audio: 'loopback' })
        })
    }
    // Cast mode: System picker will be used (see useSystemPicker option below)
    // Browse mode: getDisplayMedia won't be called at all
  }, { useSystemPicker: currentConnectionMode === 'cast' });

  mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
})