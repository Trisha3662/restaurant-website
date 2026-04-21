
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');

  ipcMain.on('show-context-menu', (event) => {
    const template = [
      {
        label: 'Hello from Menu!',
        click: () => {
          event.sender.send('context-clicked');  
        }
      },
      { type: 'separator' },
      { role: 'reload' },
      { role: 'quit' }
    ];

    const menu = Menu.buildFromTemplate(template);
    menu.popup(BrowserWindow.fromWebContents(event.sender));
  });
}


app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

module.exports = { app };